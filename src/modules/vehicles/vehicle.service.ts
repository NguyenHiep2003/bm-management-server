import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}
  async createVehicle(data: CreateVehicleDto) {
    try {
      return await this.vehicleRepository.save(data);
    } catch (error) {
      console.log('🚀 ~ VehicleService ~ createVehicle ~ error:', error);
      throw error;
    }
  }
  async getVehicleDetails(recordPerPage: number, page: number) {
    try {
      return await this.vehicleRepository.findAndCount({
        relations: { owner: true },
        take: recordPerPage,
        skip: (page - 1) * recordPerPage,
      });
    } catch (error) {
      console.log('🚀 ~ VehicleService ~ getVehicleDetails ~ error:', error);
      throw error;
    }
  }
  async getOne(numberPlate: string) {
    try {
      return await this.vehicleRepository.findOne({
        where: { numberPlate },
        relations: { owner: true },
      });
    } catch (error) {
      console.log('🚀 ~ VehicleService ~ getOne ~ error:', error);
      throw error;
    }
  }
  async deleteOne(numberPlate: string) {
    try {
      return await this.vehicleRepository.softDelete({ numberPlate });
    } catch (error) {
      console.log('🚀 ~ VehicleService ~ deleteOne ~ error:', error);
      throw error;
    }
  }
  async getVehicleOfHousehold(apartmentId: string) {
    try {
      return await this.vehicleRepository
        .createQueryBuilder('vehicle')
        .innerJoin('vehicle.owner', 'owner')
        .addSelect('owner.name')
        .where('owner.apartmentId = :apartmentId', { apartmentId })
        .getRawMany();
    } catch (error) {
      console.log(
        '🚀 ~ VehicleService ~ getVehicleOfHousehold ~ error:',
        error,
      );
      throw error;
    }
  }
}
