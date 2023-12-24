import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CharityService } from './charity.service';
import { CreateOptionalFeeDto } from './dto/create-optional-fee.dto';
import { AddDonateDto } from './dto/add-donator.dto';
import { ErrorMessage } from 'src/utils/enums/message/error';
import {
  CreateFail,
  EntityNotFound,
} from 'src/shared/custom/fail-result.custom';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('charity')
@ApiBearerAuth()
@Controller()
export class CharityController {
  constructor(private readonly charityService: CharityService) {}

  @ApiOperation({ summary: 'Tạo khoản phí từ thiện mới' })
  @Post('fee')
  async createOptionalFee(@Body() data: CreateOptionalFeeDto) {
    try {
      const { startDate, endDate } = data;
      const currentDate = new Date().getTime();
      if (new Date(endDate).getTime() < currentDate || startDate > endDate)
        throw new BadRequestException(ErrorMessage.TIME_NOT_SUITABLE);
      return await this.charityService.createOptionalFee(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách các khoản phí từ thiện' })
  @Get('fee')
  async getOptionalFee() {
    try {
      return this.charityService.getOptionalFee();
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Thêm khoản đóng góp vào quỹ có Id là feeId' })
  @Post('fee/:feeId/fund')
  async addDonate(
    @Param('feeId') optionalFeeId: string,
    @Body() data: AddDonateDto,
  ) {
    try {
      const { donatorName, amount, apartmentId } = data;
      return await this.charityService.addDonate(
        optionalFeeId,
        donatorName,
        apartmentId,
        amount,
      );
    } catch (error) {
      if (error instanceof EntityNotFound)
        throw new ConflictException(error.message);
      else if (error instanceof CreateFail)
        throw new BadRequestException(error.message);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Thống kê quỹ của khoản phí từ thiện có Id là feeId',
  })
  @Get('fee/:feeId/fund')
  async getStatisticOfFeeId(@Param('feeId') optionalFeeId: string) {
    try {
      return await this.charityService.summarizeFundOfFeeId(optionalFeeId);
    } catch (error) {
      throw error;
    }
  }
}
