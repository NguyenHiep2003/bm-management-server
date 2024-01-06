import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from 'src/modules/people/entities/people.entity';
import { Repository } from 'typeorm';
import { ApartmentService } from '../apartments/apartment.service';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { UpdatePeopleInfoDto } from './dto/update-people.dto';
import { RelationType } from 'src/utils/enums/attribute/householder';
import { TemporaryAbsent } from './entities/temporary-absent.entity';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';
import { PartialType } from '@nestjs/swagger';
import {
  EntityNotFound,
  FailResult,
  UpdateFail,
} from 'src/shared/custom/fail-result.custom';
import {
  BasePeopleInfo,
  RegisterResidenceDto,
} from './dto/register-residence.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../users/user.entity';
export class PeopleFilter extends PartialType(BasePeopleInfo) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apartmentId: string;
}
export type CreatePeople = Omit<RegisterResidenceDto, 'isCreateHousehold'>;
@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    private readonly apartmentService: ApartmentService,
    @InjectRepository(TemporaryAbsent)
    private readonly temporaryAbsentRepository: Repository<TemporaryAbsent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getHouseholdWithId(apartmentId: string) {
    try {
      const household = await this.peopleRepository
        .createQueryBuilder('people')
        .where('people.apartmentId = :apartmentId ', { apartmentId })
        .orderBy('people.createdAt', 'ASC')
        .getMany();
      return household;
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ getHouseholdWithId ~ error:', error);
      throw error;
    }
  }

  async checkExistHousehold(apartmentId: string) {
    try {
      const apartment =
        await this.apartmentService.findApartmentWithId(apartmentId);
      if (!apartment)
        throw new EntityNotFound(ErrorMessage.APARTMENT_NOT_FOUND);
      const people = await this.peopleRepository.findOne({
        where: { apartmentId },
      });
      return people ? true : false;
    } catch (error) {
      if (error instanceof EntityNotFound) throw error;
      console.log('🚀 ~ PeopleService ~ checkExistHousehold ~ error:', error);
      throw error;
    }
  }

  async savePeople(people: CreatePeople) {
    try {
      return await this.peopleRepository.save(people);
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ savePeople ~ error:', error);
      throw error;
    }
  }

  async createHousehold(apartmentId: string, people: any) {
    try {
      const apartment =
        await this.apartmentService.findApartmentWithId(apartmentId);
      if (!apartment) return null;
      apartment.people = people;
      return await this.apartmentService.saveApartment(apartment);
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ createHousehold ~ error:', error);
      throw error;
    }
  }

  async addPeopleToHousehold(apartmentId: string, people: any) {
    try {
      const apartment = await this.apartmentService.findApartmentWithId(
        apartmentId,
        false,
        true,
      );
      if (!apartment) return null;
      apartment.people.push(...people);
      return await this.apartmentService.saveApartment(apartment);
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ addPeopleToHousehold ~ error:', error);
      throw error;
    }
  }

  async getOnePeopleWithFilter(filter?: PeopleFilter) {
    try {
      return await this.peopleRepository.findOne({ where: filter });
    } catch (error) {
      console.log(
        '🚀 ~ PeopleService ~ getOnePeopleWithFilter ~ error:',
        error,
      );
    }
  }

  async getAllPeopleWithFilter(
    page: number,
    recordPerPage: number,
    filter?: PeopleFilter,
  ) {
    try {
      return await this.peopleRepository.findAndCount({
        order: { createdAt: 'ASC' },
        where: filter,
        take: recordPerPage,
        skip: (page - 1) * recordPerPage,
      });
    } catch (error) {
      console.log(
        '🚀 ~ PeopleService ~ getAllPeopleWithFilter ~ error:',
        error,
      );
      throw error;
    }
  }

  async findPeopleById(id: string) {
    try {
      return await this.peopleRepository.findOne({ where: { id } });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ getPeopleById ~ error:', error);
      throw error;
    }
  }

  async deletePeopleById(id: string) {
    try {
      const people = await this.peopleRepository.findOne({ where: { id } });
      if (people.relationWithHouseholder == RelationType.HOUSEHOLDER)
        return null;
      await this.userRepository.delete({ peopleId: id });
      await this.temporaryAbsentRepository.delete({ peopleId: id });
      return await this.peopleRepository.softDelete({ id });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ deletePeopleById ~ error:', error);
      throw error;
    }
  }

  async deleteHousehold(apartmentId: string) {
    try {
      return await this.peopleRepository.softDelete({ apartmentId });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ deleteHousehold ~ error:', error);
      throw error;
    }
  }

  async updateOne(id: string, data: UpdatePeopleInfoDto) {
    try {
      return await this.peopleRepository.update({ id }, data);
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ updateOne ~ error:', error);
      throw error;
    }
  }

  async updateResidencyStatus(peopleId: string, status: ResidencyStatus) {
    try {
      const people = await this.peopleRepository.findOne({
        where: { id: peopleId },
      });
      if (!people) throw new EntityNotFound(ErrorMessage.PEOPLE_NOT_FOUND);
      if (people.status == status)
        throw new UpdateFail(ErrorMessage.UPDATE_RESIDENCY_NOT_CHANGE);
      const previousStatus = people.status;
      people.status = status;
      await this.peopleRepository.save(people);
      return previousStatus;
    } catch (error) {
      if (error instanceof FailResult) {
        throw error;
      }
      console.log('🚀 ~ PeopleService ~ updateResidencyStatus ~ error:', error);
      throw error;
    }
  }

  async createTemporaryAbsent(
    peopleId: string,
    reason: string,
    startDate: Date,
    endDate: Date,
    destinationAddress: string,
    previousStatus: ResidencyStatus,
  ) {
    try {
      return await this.temporaryAbsentRepository.save({
        peopleId,
        reason,
        startDate,
        endDate,
        destinationAddress,
        previousStatus,
      });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ error:', error);
      throw error;
    }
  }

  async rollbackStatusAfterAbsent(peopleId: string) {
    try {
      const temporaryAbsent = await this.temporaryAbsentRepository.findOne({
        where: { peopleId },
      });
      if (!temporaryAbsent)
        throw new EntityNotFound(ErrorMessage.TEMPORARY_ABSENT_NOT_FOUND);
      await this.peopleRepository.update(
        { id: peopleId },
        { status: temporaryAbsent.previousStatus },
      );
      return await this.temporaryAbsentRepository.softDelete({ peopleId });
    } catch (error) {
      if (error instanceof EntityNotFound) throw error;
      console.log(
        '🚀 ~ PeopleService ~ rollBackStatusAfterAbsent ~ error:',
        error,
      );
      throw error;
    }
  }

  async getAbsentList(recordPerPage: number, page: number) {
    try {
      return await this.temporaryAbsentRepository.findAndCount({
        order: { createdAt: 'DESC' },
        take: recordPerPage,
        skip: (page - 1) * recordPerPage,
        relations: { people: true },
      });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ getAbsentList ~ error:', error);
      throw error;
    }
  }
}
