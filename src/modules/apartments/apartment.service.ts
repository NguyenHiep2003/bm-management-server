import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { EntityNotFound } from 'src/shared/custom/fail-result.custom';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}
  async saveApartment(data: CreateApartmentDto) {
    try {
      return await this.apartmentRepository.save(data);
    } catch (error) {
      console.log('🚀 ~ ApartmentService ~ createApartment ~ error:', error);
      throw error;
    }
  }
  async findApartmentWithId(
    id: string,
    withOwner: boolean = false,
    withPeopleLiveIn: boolean = false,
  ) {
    try {
      return await this.apartmentRepository.findOne({
        where: { apartmentId: id },
        relations: {
          owner: withOwner,
          people: withPeopleLiveIn,
        },
      });
    } catch (error) {
      console.log(
        '🚀 ~ ApartmentService ~ findApartmentWithId ~ error:',
        error,
      );
      throw error;
    }
  }
  async getDetailsAllApartments(page: number, recordPerPage: number) {
    try {
      return await this.apartmentRepository.findAndCount({
        relations: { owner: true },
        take: recordPerPage,
        skip: (page - 1) * recordPerPage,
      });
    } catch (error) {
      console.log(
        '🚀 ~ ApartmentService ~ getDetailsAllApartments ~ error:',
        error,
      );
      throw error;
    }
  }
  async updateOwner(apartmentId: string, data: UpdateOwnerDto) {
    try {
      const apartment = await this.apartmentRepository.findOne({
        where: { apartmentId },
        relations: {
          owner: true,
        },
      });
      if (!apartment)
        throw new EntityNotFound(ErrorMessage.APARTMENT_NOT_FOUND);
      const oldOwner = apartment.owner;
      const owner = this.ownerRepository.create(data);
      apartment.owner = owner;
      await this.apartmentRepository.save(apartment);
      if (oldOwner) {
        await this.ownerRepository.remove(oldOwner);
      }
      return true;
    } catch (error) {
      if (error instanceof EntityNotFound) throw error;
      console.log('🚀 ~ ApartmentService ~ updateOwner ~ error:', error);
      throw error;
    }
  }

  async getListApartmentId() {
    try {
      return await this.apartmentRepository.find({ select: ['apartmentId'] });
    } catch (error) {
      console.log('🚀 ~ ApartmentService ~ getListApartmentId ~ error:', error);
      throw error;
    }
  }
}
