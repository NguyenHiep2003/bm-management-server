import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fee } from './entities/fee.entity';
import { LessThan, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { Bill } from './entities/bill.entity';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { People } from '../people/entities/people.entity';
import { BillStatus } from 'src/utils/enums/attribute/bill-status';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';
import {
  CreateFail,
  EntityNotFound,
  FailResult,
  UpdateFail,
} from 'src/shared/custom/fail-result.custom';
import { User } from '../users/user.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { FeeUnit } from 'src/utils/enums/attribute/fee-unit';
import { Vehicle } from '../vehicles/vehicle.entity';
import { FeeName, ThirdPartyFeeName } from 'src/utils/enums/attribute/fee-name';
import { VehicleType } from 'src/utils/enums/attribute/vehicle-type';
import { getRatio } from 'src/utils/helper';
import { CreateBillsDto } from './dto/create-bill.dto';
import { ApartmentService } from '../apartments/apartment.service';
@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(Fee) private readonly feeRepository: Repository<Fee>,
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly apartmentService: ApartmentService,
  ) {}

  async addFee(data: CreateFeeDto) {
    try {
      return await this.feeRepository.save(data);
    } catch (error) {
      console.log('🚀 ~ FeeService ~ addFee ~ error:', error);
      throw error;
    }
  }
  async getAllFee() {
    try {
      return await this.feeRepository.find();
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getAllFee ~ error:', error);
      throw error;
    }
  }

  async getFeeByName(name: FeeName) {
    try {
      return await this.feeRepository.findOne({ where: { name } });
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getFeeByName ~ error:', error);
      throw error;
    }
  }

  async deleteFee(id: string) {
    try {
      return await this.feeRepository.softDelete({ id });
    } catch (error) {
      console.log('🚀 ~ FeeService ~ deleteFee ~ error:', error);
      throw error;
    }
  }

  async updateFee(id: string, data: UpdateFeeDto) {
    try {
      return await this.feeRepository.update({ id }, data);
    } catch (error) {
      console.log('🚀 ~ FeeService ~ updateFee ~ error:', error);
      throw error;
    }
  }

  async checkExistBillCreatedByServer() {
    try {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const existBill = await this.billRepository
        .createQueryBuilder('bill')
        .withDeleted()
        .innerJoin('bill.fee', 'fee')
        .where('fee.name = :service OR fee.name = :management', {
          service: FeeName.SERVICE,
          management: FeeName.MANAGEMENT,
        })
        .andWhere('month = :month', { month })
        .andWhere('year =:year', { year })
        .addSelect('fee.name')
        .getOne();
      return existBill ? true : false;
    } catch (error) {
      console.log(
        '🚀 ~ FeeService ~ checkExistBillCreatedByServer ~ error:',
        error,
      );
      throw error;
    }
  }

  async createBills() {
    try {
      const isExistBillCreatedByServer =
        await this.checkExistBillCreatedByServer();
      if (isExistBillCreatedByServer)
        throw new CreateFail(ErrorMessage.BILL_EXIST);
      const billsBaseArea = await this.feeRepository
        .createQueryBuilder('fee')
        // .withDeleted()
        .innerJoin(
          (subQuery: SelectQueryBuilder<People>) =>
            subQuery
              .select('people.apartmentId', 'apartment_id')
              .from(People, 'people')
              .distinctOn(['people.apartmentId'])
              .where('status != :status', {
                status: ResidencyStatus.TEMPORARILY_ABSENT,
              })
              .innerJoin('people.apartment', 'apartment')
              .addSelect('apartment.area', 'area'),
          'apartment',
          '1 = 1',
        )
        .where('fee.unit = :unit', { unit: FeeUnit.AREA })
        .select('apartment.apartment_id', 'apartmentId')
        .addSelect('fee.id', 'feeId')
        .addSelect('apartment.area * fee.price', 'amount')
        .getRawMany();
      const billsOnVehicle = await this.feeRepository
        .createQueryBuilder('fee')
        .innerJoin(
          (subQuery: SelectQueryBuilder<Vehicle>) =>
            subQuery
              .select('vehicle.type', 'type')
              .from(Vehicle, 'vehicle')
              .innerJoin('vehicle.owner', 'owner')
              .addSelect('owner.apartmentId', 'apartment_id'),
          'vhc_apt',
          '(vhc_apt.type = :motor AND fee.name = :motorFee) OR (vhc_apt.type = :car AND fee.name = :carFee)',
          {
            motor: VehicleType.MOTORBIKE,
            motorFee: FeeName.MOTORBIKE,
            car: VehicleType.CAR,
            carFee: FeeName.CAR,
          },
        )
        .where('fee.name in (:...name)', {
          name: [FeeName.MOTORBIKE, FeeName.CAR],
        })
        .select('vhc_apt.apartment_id', 'apartmentId')
        .addSelect('fee.id', 'feeId')
        .addSelect('fee.price', 'amount')
        .getRawMany();
      return await this.billRepository.save([
        ...billsBaseArea,
        ...billsOnVehicle,
      ]);
    } catch (error) {
      if (error instanceof CreateFail) throw error;
      console.log('🚀 ~ FeeService ~ createBill ~ error:', error);
      throw error;
    }
  }

  async createBillForNewVehicle(apartmentId: string, type: VehicleType) {
    try {
      const isExistBillCreatedByServer =
        await this.checkExistBillCreatedByServer();
      //Bill have not been created by server then wait
      if (!isExistBillCreatedByServer) return;
      const feeName = type == VehicleType.CAR ? FeeName.CAR : FeeName.MOTORBIKE;
      const fee = await this.feeRepository.findOne({
        where: { name: feeName },
      });
      const date = new Date().getDate();
      const ratio = getRatio(date);
      return await this.billRepository.save({
        apartmentId,
        feeId: fee.id,
        amount: fee.price * ratio,
      });
    } catch (error) {
      console.log('🚀 ~ FeeService ~ createBillForNewVehicle ~ error:', error);
      throw error;
    }
  }

  async createBillForNewHousehold(apartmentId: string, ratio: number) {
    try {
      const date = new Date();
      const isExistBillCreatedByServer =
        await this.checkExistBillCreatedByServer();
      //Bill have not been created by server then wait
      if (!isExistBillCreatedByServer) return;
      const existBillOfApartment = await this.billRepository.findOne({
        where: {
          apartmentId,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      });
      //Bill of this apartment have been created this month
      if (existBillOfApartment) return;
      const bill = await this.feeRepository
        .createQueryBuilder('fee')
        .innerJoin(
          (subQuery: SelectQueryBuilder<Apartment>) =>
            subQuery
              .select('apartment.apartmentId', 'apartment_id')
              .from(Apartment, 'apartment')
              .where('apartment.apartmentId = :apartmentId', {
                apartmentId,
              })
              .addSelect('apartment.area', 'area'),
          'apartment',
          '1 = 1',
        )
        .where('fee.unit = :unit', { unit: FeeUnit.AREA })
        .select('apartment.apartment_id', 'apartmentId')
        .addSelect('fee.id', 'feeId')
        .addSelect(`apartment.area * fee.price * ${ratio}`, 'amount')
        .getRawMany();
      return await this.billRepository.save(bill);
    } catch (error) {
      console.log(
        '🚀 ~ FeeService ~ createBillForNewHousehold ~ error:',
        error,
      );
      throw error;
    }
  }

  async deleteBillAfter2Year() {
    try {
      const expiredDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2);
      return await this.billRepository.delete({
        createdAt: LessThan(expiredDate),
        status: BillStatus.HAVE_PAID,
      });
    } catch (error) {
      console.log('🚀 ~ FeeService ~ deleteBillAfterSixMonth ~ error:', error);
    }
  }

  async getAllBillsOfAnApartment(
    apartmentId: string,
    month: number,
    year: number,
  ) {
    try {
      const bill = await this.billRepository
        .createQueryBuilder('bill')
        .withDeleted()
        .leftJoin('bill.fee', 'fee')
        .select([
          'bill.id',
          'bill.apartmentId',
          'bill.month',
          'bill.year',
          'fee.name',
          'bill.status',
          'bill.payDay',
          'bill.amount',
          'bill.payerName',
          'bill.billCollector',
        ])
        .where('bill.apartmentId = :apartmentId', { apartmentId })
        .andWhere('bill.month = :month', { month })
        .andWhere('bill.year = :year', { year })
        .getMany();
      let total = 0;
      for (const record of bill) {
        if (record.status == BillStatus.DEBT) total += record.amount;
      }
      return { record: bill, total };
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getAllBills ~ error:', error);
      throw error;
    }
  }

  async getSummaryOfPayment(month: number, year: number, status: BillStatus[]) {
    try {
      if (status[0] == undefined)
        status = [BillStatus.DEBT, BillStatus.HAVE_PAID];
      const bills = await this.billRepository
        .createQueryBuilder('bill')
        .select([
          'bill.apartmentId',
          'bill.month',
          'bill.year',
          'bill.status',
          'bill.payDay',
          'bill.payerName',
          'bill.billCollector',
        ])
        .addSelect('sum(bill.amount)', 'total')
        .groupBy('bill.apartmentId')
        .addGroupBy('bill.month')
        .addGroupBy('bill.year')
        .addGroupBy('bill.status')
        .addGroupBy('bill.payDay')
        .addGroupBy('bill.payerName')
        .addGroupBy('bill.billCollector')
        .where('bill.status in (:...status)', { status })
        .andWhere('bill.month = :month', { month })
        .andWhere('bill.year = :year', { year })
        .addOrderBy('bill.apartmentId', 'ASC')
        .getRawMany();
      return bills;
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getSummaryOfPayment ~ error:', error);
      throw error;
    }
  }

  async addPayment(
    apartmentId: string,
    payMoney: number,
    month: number,
    year: number,
    payerName: string,
    billCollectorId: string,
  ) {
    try {
      const totalFee = await this.billRepository
        .createQueryBuilder('bill')
        .select('sum(bill.amount)', 'total')
        .addSelect('bill.status', 'status')
        .groupBy('bill.apartmentId')
        .addGroupBy('bill.month')
        .addGroupBy('bill.year')
        .addGroupBy('bill.status')
        .addGroupBy('bill.payDay')
        .addGroupBy('bill.payerName')
        .where('bill.status = :status', { status: BillStatus.DEBT })
        .andWhere('bill.apartmentId = :apartmentId', { apartmentId })
        .andWhere('bill.month = :month', { month })
        .andWhere('bill.year = :year', { year })
        .getRawOne();
      if (!totalFee) throw new EntityNotFound(ErrorMessage.BILL_NOT_FOUND);
      if (totalFee.status == BillStatus.HAVE_PAID)
        throw new UpdateFail(ErrorMessage.BILL_HAVE_BEEN_PAID);
      if (totalFee.total != payMoney)
        throw new UpdateFail(ErrorMessage.MONEY_NOT_SUITABLE);
      const billCollector = await this.userRepository.findOne({
        where: { id: billCollectorId },
        relations: { people: true },
      });
      return await this.billRepository.update(
        { apartmentId, month, year },
        {
          payDay: new Date(),
          payerName,
          status: BillStatus.HAVE_PAID,
          billCollector: billCollector.people?.name,
        },
      );
    } catch (error) {
      if (error instanceof FailResult) throw error;
      console.log('🚀 ~ FeeService ~ error:', error);
      throw error;
    }
  }

  async addSinglePayment(
    id: string,
    payMoney: number,
    payerName: string,
    billCollectorId: string,
  ) {
    try {
      const bill = await this.billRepository.findOne({ where: { id } });
      if (!bill) throw new EntityNotFound(ErrorMessage.BILL_NOT_FOUND);
      if (bill.status === BillStatus.HAVE_PAID)
        throw new UpdateFail(ErrorMessage.BILL_HAVE_BEEN_PAID);
      if (bill.amount !== payMoney)
        throw new UpdateFail(ErrorMessage.MONEY_NOT_SUITABLE);
      const billCollector = await this.userRepository.findOne({
        where: { id: billCollectorId },
        relations: { people: true },
      });
      bill.status = BillStatus.HAVE_PAID;
      bill.billCollector = billCollector.people?.name;
      bill.payerName = payerName;
      bill.payDay = new Date();
      return await this.billRepository.save(bill);
    } catch (error) {
      if (error instanceof FailResult) throw error;
      console.log('🚀 ~ FeeService ~ error:', error);
      throw error;
    }
  }

  async getAllDebt() {
    try {
      return await this.billRepository
        .createQueryBuilder('bill')
        .select([
          'bill.apartmentId',
          'bill.month',
          'bill.year',
          'bill.status',
          'bill.payDay',
          'bill.payerName',
        ])
        .addSelect('sum(bill.amount)', 'total')
        .groupBy('bill.apartmentId')
        .addGroupBy('bill.month')
        .addGroupBy('bill.year')
        .addGroupBy('bill.status')
        .addGroupBy('bill.payDay')
        .addGroupBy('bill.payerName')
        .addOrderBy('bill.apartmentId', 'ASC')
        .where('bill.status = :status', { status: BillStatus.DEBT })
        .getRawMany();
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getAllDebt ~ error:', error);
      throw error;
    }
  }

  async checkExistDebtBill(apartmentId: string) {
    try {
      const debtBill = await this.billRepository.findOne({
        where: { apartmentId, status: BillStatus.DEBT },
      });
      return debtBill ? true : false;
    } catch (error) {
      console.log('🚀 ~ FeeService ~ checkExistDebtBell ~ error:', error);
      throw error;
    }
  }
  async checkExistBillOfFeeNameAtMonth(
    month: number,
    year: number,
    name: ThirdPartyFeeName,
  ) {
    try {
      const bill = await this.billRepository
        .createQueryBuilder('bill')
        .withDeleted()
        .innerJoin('bill.fee', 'fee')
        .where('fee.name = :name', {
          name,
        })
        .andWhere('month = :month', { month })
        .andWhere('year =:year', { year })
        .addSelect('fee.name')
        .getOne();
      return bill ? true : false;
    } catch (error) {
      console.log(
        '🚀 ~ FeeService ~ constcheckExistBillOfFeeNameThisMonth ~ error:',
        error,
      );
      throw error;
    }
  }

  async upsertFeeAndReturn(
    name: ThirdPartyFeeName,
    price: number,
    unit: FeeUnit,
  ) {
    try {
      const existFee = await this.feeRepository.findOne({
        where: { name },
      });
      if (existFee) {
        existFee.price = price;
        existFee.unit = unit;
        return await this.feeRepository.save(existFee);
      } else
        return await this.feeRepository.save({
          name,
          price,
          unit,
        });
    } catch (error) {
      console.log('🚀 ~ FeeService ~ upsertFeeAndReturn ~ error:', error);
      throw error;
    }
  }
  // async handleCreateElectricityBillAndUpsertFee(data: CreateBillsDto) {
  //   try {
  //     const { month, year, unit, price, bills } = data;
  //     const isExistBill = await this.checkExistBillOfFeeNameAtMonth(
  //       month,
  //       year,
  //       ThirdPartyService.ELECTRICITY_SERVICE,
  //     );
  //     if (isExistBill) throw new CreateFail(ErrorMessage.BILL_EXIST);
  //     const fee = await this.upsertFeeAndReturn(
  //       ThirdPartyService.ELECTRICITY_SERVICE,
  //       price,
  //       unit,
  //     );
  //     const apartmentList = await this.apartmentService.getListApartmentId();
  //     bills.forEach((bill, index) => {
  //       const existApartmentId = apartmentList.find(
  //         (apartment) => apartment.apartmentId === bill.apartmentId,
  //       );
  //       console.log(bills[index], '>>>');
  //       if (!existApartmentId)
  //         throw new CreateFail(`Hộ số ${bill.apartmentId} không tồn tại`);
  //       else
  //         bills[index] = { ...bills[index], month, year, feeId: fee.id } as any;
  //     });
  //     await this.billRepository.save(bills);
  //   } catch (error) {
  //     if (error instanceof FailResult) throw error;
  //     console.log(
  //       '🚀 ~ FeeService ~ handleCreateElectricityBillAndUpsertFee ~ error:',
  //       error,
  //     );
  //     throw error;
  //   }
  // }

  async handleCreateBillAndUpsertFee(
    data: CreateBillsDto,
    name: ThirdPartyFeeName,
  ) {
    try {
      const { month, year, unit, price, bills } = data;
      const isExistBill = await this.checkExistBillOfFeeNameAtMonth(
        month,
        year,
        name,
      );
      if (isExistBill) throw new CreateFail(ErrorMessage.BILL_EXIST);
      const fee = await this.upsertFeeAndReturn(name, price, unit);
      const apartmentList = await this.apartmentService.getListApartmentId();
      bills.forEach((bill, index) => {
        const existApartmentId = apartmentList.find(
          (apartment) => apartment.apartmentId === bill.apartmentId,
        );
        if (!existApartmentId)
          throw new CreateFail(`Hộ số ${bill.apartmentId} không tồn tại`);
        else
          bills[index] = { ...bills[index], month, year, feeId: fee.id } as any;
      });
      await this.billRepository.save(bills);
    } catch (error) {
      if (error instanceof FailResult) throw error;
      console.log('🚀 ~ FeeService ~ error:', error);
      throw error;
    }
  }
}
