import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fee } from './entities/fee.entity';
import { Repository } from 'typeorm';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(Fee) private readonly feeRepository: Repository<Fee>,
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
}
