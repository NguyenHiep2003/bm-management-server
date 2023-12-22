import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CharityService } from './charity.service';
import { CreateOptionalFeeDto } from './dto/create-optional-fee.dto';
import { AddDonateDto } from './dto/add-donator.dto';

@Controller()
export class CharityController {
  constructor(private readonly charityService: CharityService) {}

  @Post('fee')
  async createOptionalFee(@Body() data: CreateOptionalFeeDto) {
    try {
      const { startDate, endDate } = data;
      const currentDate = new Date().getTime();
      if (new Date(endDate).getTime() < currentDate || startDate > endDate)
        throw new BadRequestException('start date and end date not suitable');
      return await this.charityService.createOptionalFee(data);
    } catch (error) {
      throw error;
    }
  }

  @Get('fee')
  async getOptionalFee() {
    try {
      await this.charityService.summarizeFundOfFeeId(
        'b096d788-dbf8-4b5f-96d5-1e3023a936d1',
      );
      return this.charityService.getOptionalFee();
    } catch (error) {
      throw error;
    }
  }

  @Post('fund')
  async addDonate(@Body() data: AddDonateDto) {
    try {
      const { donatorName, optionalFeeId, amount, apartmentId } = data;
      return await this.charityService.addDonate(
        optionalFeeId,
        donatorName,
        apartmentId,
        amount,
      );
    } catch (error) {
      throw error;
    }
  }
  @Get('fund/:feeId')
  async getStatisticOfFeeId(@Param('feeId') optionalFeeId: string) {
    try {
      return await this.charityService.summarizeFundOfFeeId(optionalFeeId);
    } catch (error) {
      throw error;
    }
  }
}
