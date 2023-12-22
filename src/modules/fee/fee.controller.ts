import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { RolesDecor } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { GetFeeOfApartmentQueryDto } from './dto/get-fee-of-apartment-query.dto';
import { GetSummaryPaymentDto } from './dto/get-summary-payment.dto';
import { AddPaymentDto } from './dto/add-payment.dto';

@UseGuards(RoleAuthGuard)
@RolesDecor([Role.MANAGER])
@Controller()
export class FeeController {
  constructor(private readonly feeService: FeeService) {}
  @Post()
  async addNewFee(@Body() data: CreateFeeDto) {
    try {
      return await this.feeService.addFee(data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAllFee() {
    try {
      return await this.feeService.getAllFee();
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteFee(@Param('id') id: string) {
    try {
      return await this.feeService.deleteFee(id);
    } catch (error) {
      throw error;
    }
  }

  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @Get('bills/dept')
  async getAllDept() {
    try {
      return await this.feeService.getAllDebt();
    } catch (error) {
      throw error;
    }
  }

  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @Get('bills/:apartmentId')
  async getBills(
    @Param('apartmentId') apartmentId: string,
    @Query() feeQuery: GetFeeOfApartmentQueryDto,
  ) {
    try {
      const { month, year } = feeQuery;
      return await this.feeService.getAllBillsOfAnApartment(
        apartmentId,
        month,
        year,
      );
    } catch (error) {
      throw error;
    }
  }

  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @Get('bills')
  async getAllPayment(@Query() filter: GetSummaryPaymentDto) {
    try {
      const { month, year, status } = filter;
      return await this.feeService.getSummaryOfPayment(month, year, [status]);
    } catch (error) {
      throw error;
    }
  }

  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @Post('bills')
  async createBills() {
    try {
      return await this.feeService.createBills();
    } catch (error) {
      throw error;
    }
  }
  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @Patch('bills')
  async addPayment(@Body() data: AddPaymentDto) {
    try {
      const { month, year, payMoney, payerName, apartmentId } = data;
      return await this.feeService.addPayment(
        apartmentId,
        payMoney,
        month,
        year,
        payerName,
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateFee(@Param('id') id: string, @Body() data: UpdateFeeDto) {
    try {
      return await this.feeService.updateFee(id, data);
    } catch (error) {
      throw error;
    }
  }
}
