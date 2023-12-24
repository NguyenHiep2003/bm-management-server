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
@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(Fee) private readonly feeRepository: Repository<Fee>,
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
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

  async createBills() {
    try {
      const existBill = await this.billRepository.findOne({
        where: { month: new Date().getMonth(), year: new Date().getFullYear() },
      });
      if (existBill) throw new CreateFail(ErrorMessage.BILL_EXIST);
      const bills = await this.feeRepository
        .createQueryBuilder('fee')
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
        .select('apartment.apartment_id', 'apartmentId')
        .addSelect('fee.id', 'feeId')
        .addSelect('apartment.area * fee.unitPrice', 'amount')
        .getRawMany();
      return await this.billRepository.save(bills);
    } catch (error) {
      if (error instanceof CreateFail) throw error;
      console.log('🚀 ~ FeeService ~ createBill ~ error:', error);
      throw error;
    }
  }

  async deleteBillAfterSixMonth() {
    try {
      const expiredDate = new Date(
        Date.now() - (1000 * 60 * 60 * 24 * 365) / 2,
      );
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
        .innerJoin('bill.fee', 'fee')
        .select([
          'bill.apartmentId',
          'bill.month',
          'bill.year',
          'fee.name',
          'bill.status',
          'bill.payDay',
          'bill.amount',
          'bill.payerName',
        ])
        .where('bill.apartmentId = :apartmentId', { apartmentId })
        .andWhere('bill.month = :month', { month })
        .andWhere('bill.year = :year', { year })
        .getMany();
      let total = 0;
      for (const record of bill) {
        total += record.amount;
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
      const bill = await this.billRepository
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
        .where('bill.status in (:...status)', { status })
        .andWhere('bill.month = :month', { month })
        .andWhere('bill.year = :year', { year })
        .getRawMany();
      return bill;
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
        // .where('bill.status = :status', { status: BillStatus.DEBT })
        .andWhere('bill.apartmentId = :apartmentId', { apartmentId })
        .andWhere('bill.month = :month', { month })
        .andWhere('bill.year = :year', { year })
        .getRawOne();
      if (!totalFee) throw new EntityNotFound(ErrorMessage.BILL_NOT_FOUND);
      if (totalFee.status == BillStatus.HAVE_PAID)
        throw new UpdateFail(ErrorMessage.BILL_HAVE_BEEN_PAID);
      if (totalFee.total != payMoney)
        throw new UpdateFail(ErrorMessage.MONEY_NOT_SUITABLE);
      return await this.billRepository.update(
        { apartmentId, month, year },
        { payDay: new Date(), payerName, status: BillStatus.HAVE_PAID },
      );
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
        .where('bill.status = :status', { status: BillStatus.DEBT })
        .getRawMany();
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getAllDebt ~ error:', error);
      throw error;
    }
  }
}
