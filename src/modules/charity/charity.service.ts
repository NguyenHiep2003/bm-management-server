import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionalFee } from './entities/optional-fee.entity';
import { CharityFund } from './entities/charity-fund.entity';
import { CreateOptionalFeeDto } from './dto/create-optional-fee.dto';
import { Repository } from 'typeorm';
import { PeopleService } from '../people/people.service';

@Injectable()
export class CharityService {
  constructor(
    @InjectRepository(OptionalFee)
    private readonly optionalFeeRepository: Repository<OptionalFee>,
    @InjectRepository(CharityFund)
    private readonly charityFundRepository: Repository<CharityFund>,
    private readonly peopleService: PeopleService,
  ) {}
  async createOptionalFee(data: CreateOptionalFeeDto) {
    try {
      return await this.optionalFeeRepository.save(data);
    } catch (error) {
      console.log('🚀 ~ CharityService ~ createOptionalFee ~ error:', error);
      throw error;
    }
  }

  async getOptionalFee() {
    try {
      return await this.optionalFeeRepository.find({
        order: { endDate: 'DESC' },
      });
    } catch (error) {
      console.log('🚀 ~ CharityService ~ getOptionalFee ~ error:', error);
      throw error;
    }
  }

  async addDonate(
    optionalFeeId: string,
    donatorName: string,
    apartmentId: string,
    amount: number,
  ) {
    try {
      const people = await this.peopleService.getAllPeople(null, null, {
        name: donatorName,
        apartmentId,
      });
      if (!people[0]) throw new BadRequestException();
      const fee = await this.optionalFeeRepository.findOne({
        where: { id: optionalFeeId },
      });
      if (!fee) throw new BadRequestException('Fee not found');
      if (fee.endDate.getTime() < new Date().getTime())
        throw new BadRequestException('Expired Fee');
      return await this.charityFundRepository.save({
        optionalFeeId,
        donatorName,
        apartmentId,
        amount,
      });
    } catch (error) {
      console.log('🚀 ~ CharityService ~ error:', error);
      throw error;
    }
  }

  async summarizeFundOfFeeId(optionalFeeId: string) {
    try {
      const data = await this.charityFundRepository
        .createQueryBuilder('fund')
        .select([
          'fund.donatorName AS donator',
          'fund.apartmentId as apartmentId',
        ])
        .addSelect('SUM(fund.amount)', 'total')
        .groupBy('fund.donatorName')
        .addGroupBy('fund.apartmentId')
        .where('fund.optionalFeeId = :optionalFeeId', { optionalFeeId })
        .getRawMany();
      let sum = 0;
      for (const record of data) {
        sum += Number(record.total);
      }
      return { data, sum };
    } catch (error) {
      console.log('🚀 ~ CharityService ~ summarizeFundOfFeeId ~ error:', error);
    }
  }
}
