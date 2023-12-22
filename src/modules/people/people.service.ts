import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from 'src/modules/people/entities/people.entity';
import { Repository } from 'typeorm';
import { ApartmentService } from '../apartments/apartment.service';
import { ErrorMessage } from 'src/utils/enums/message/exception';
import { UpdatePeopleInfoDto } from './dto/update-people.dto';
import { RelationType } from 'src/utils/enums/attribute/householder';
import { TemporaryAbsent } from './entities/temporary-absent.entity';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';
import { PartialType, PickType } from '@nestjs/swagger';
export class PeopleFilter extends PickType(PartialType(People), [
  'email',
  'name',
  'gender',
  'nation',
  'phoneNumber',
  'citizenId',
  'apartmentId',
]) {}
@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    private readonly apartmentService: ApartmentService,
    @InjectRepository(TemporaryAbsent)
    private readonly temporaryAbsentRepository: Repository<TemporaryAbsent>,
  ) {}
  async getHouseholdWithId(apartmentId: string) {
    try {
      const household = await this.peopleRepository
        .createQueryBuilder('people')
        .where('people.apartmentId = :apartmentId ', { apartmentId })
        .getMany();
      return household;
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ getHouseholdWithId ~ error:', error);
      throw error;
    }
  }
  async createHousehold(apartmentId: string, people: any) {
    try {
      const apartment =
        await this.apartmentService.findApartmentWithId(apartmentId);
      if (!apartment)
        throw new BadRequestException(ErrorMessage.APARTMENT_NOT_FOUND);
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
      if (!apartment)
        throw new BadRequestException(ErrorMessage.APARTMENT_NOT_FOUND);
      apartment.people.push(...people);
      return await this.apartmentService.saveApartment(apartment);
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ addPeopleToHousehold ~ error:', error);
      throw error;
    }
  }

  async getAllPeople(
    page: number,
    recordPerPage: number,
    filter?: PeopleFilter,
  ) {
    try {
      return await this.peopleRepository.find({
        where: filter,
        take: recordPerPage,
        skip: page * recordPerPage,
      });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ getAllPeople ~ error:', error);
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
        throw new BadRequestException(
          ErrorMessage.CANNOT_DELETE_HOUSEHOLDER_THIS_WAY,
        );
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
      if (!people) throw new BadRequestException(ErrorMessage.PEOPLE_NOT_FOUND);
      if (people.status == status)
        throw new BadRequestException('update failed');
      const previousStatus = people.status;
      people.status = status;
      await this.peopleRepository.save(people);
      return previousStatus;
    } catch (error) {
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
        throw new BadRequestException(
          'Temporary absent of this people not found',
        );
      await this.peopleRepository.update(
        { id: peopleId },
        { status: temporaryAbsent.previousStatus },
      );
      return await this.temporaryAbsentRepository.softDelete({ peopleId });
    } catch (error) {
      console.log(
        '🚀 ~ PeopleService ~ rollBackStatusAfterAbsent ~ error:',
        error,
      );
      throw error;
    }
  }

  async getAbsentList() {
    try {
      return await this.temporaryAbsentRepository.find({
        relations: { people: true },
      });
    } catch (error) {
      console.log('🚀 ~ PeopleService ~ getAbsentList ~ error:', error);
      throw error;
    }
  }
}
