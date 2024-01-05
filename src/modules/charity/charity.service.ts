import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionalFee } from './entities/optional-fee.entity';
import { CharityFund } from './entities/charity-fund.entity';
import { CreateOptionalFeeDto } from './dto/create-optional-fee.dto';
import { Repository } from 'typeorm';
import { PeopleService } from '../people/people.service';
import {
  CreateFail,
  EntityNotFound,
  FailResult,
} from 'src/shared/custom/fail-result.custom';
import { ErrorMessage } from 'src/utils/enums/message/error';

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

  async addDonate(optionalFeeId: string, peopleId: string, amount: number) {
    try {
      const people = await this.peopleService.findPeopleById(peopleId);
      if (!people) throw new EntityNotFound(ErrorMessage.PEOPLE_NOT_FOUND);
      const fee = await this.optionalFeeRepository.findOne({
        where: { id: optionalFeeId },
      });
      if (!fee) throw new EntityNotFound(ErrorMessage.FEE_NOT_FOUND);
      if (
        fee.endDate.getTime() < new Date().getTime() ||
        fee.startDate.getTime() > new Date().getTime()
      )
        throw new CreateFail(ErrorMessage.EXPIRED_FEE_OR_TOO_EARLY_TO_DONATE);
      return await this.charityFundRepository.save({
        optionalFeeId,
        peopleId,
        amount,
      });
    } catch (error) {
      if (error instanceof FailResult) throw error;
      console.log('🚀 ~ CharityService ~ error:', error);
      throw error;
    }
  }

  async summarizeFundOfFeeId(optionalFeeId: string) {
    try {
      const data = await this.charityFundRepository
        .createQueryBuilder('fund')
        .withDeleted()
        .leftJoin('fund.people', 'people')
        .select([
          'people.name AS donator',
          'people.apartmentId as apartmentId',
          'people.citizenId as citizenId',
          'people.id as id',
        ])
        .addSelect('SUM(fund.amount)', 'total')
        .groupBy('people.id')
        // .addGroupBy('fund.apartmentId')
        .where('fund.optionalFeeId = :optionalFeeId', { optionalFeeId })
        .getRawMany();
      let sum = 0;
      for (const record of data) {
        sum += Number(record.total);
      }
      return { fund: data, sum };
    } catch (error) {
      console.log('🚀 ~ CharityService ~ summarizeFundOfFeeId ~ error:', error);
    }
  }
}
