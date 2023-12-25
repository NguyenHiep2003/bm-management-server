import {
  BadRequestException,
  Body,
  ConflictException,
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
import { RolesDecor } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { GetFeeOfApartmentQueryDto } from './dto/get-fee-of-apartment-query.dto';
import { GetSummaryPaymentDto } from './dto/get-summary-payment.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { CreateFail, FailResult } from 'src/shared/custom/fail-result.custom';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/custom/pagination.query';

@ApiTags('fee')
@ApiBearerAuth()
@Controller()
export class FeeController {
  constructor(private readonly feeService: FeeService) {}
  @ApiOperation({ summary: 'Tạo khoản phí mới (chỉ dành cho quản lý)' })
  @UseGuards(RoleAuthGuard)
  @RolesDecor([Role.MANAGER])
  @Post()
  async addNewFee(@Body() data: CreateFeeDto) {
    try {
      return await this.feeService.addFee(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy thông tin các khoản phí hiện tại' })
  @Get()
  async getAllFee() {
    try {
      return await this.feeService.getAllFee();
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Xóa một khoản phí (chỉ dành cho quản lý)' })
  @UseGuards(RoleAuthGuard)
  @RolesDecor([Role.MANAGER])
  @Delete(':id')
  async deleteFee(@Param('id') id: string) {
    try {
      return await this.feeService.deleteFee(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách tất cả các hóa đơn đang bị nợ' })
  @Get('bills/dept')
  async getAllDept(@Query() query: PaginationQuery) {
    try {
      const deptList = await this.feeService.getAllDebt();
      const { recordPerPage, page } = query;
      const totalRecord = deptList.length;
      const totalPage = Math.ceil(totalRecord / recordPerPage);
      return {
        totalRecord,
        totalPage,
        deptList: deptList.slice(
          (page - 1) * recordPerPage,
          page * recordPerPage,
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Lấy thông tin hóa đơn của một căn hộ theo năm, tháng',
  })
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

  @ApiOperation({
    summary:
      'Lấy danh sách các hóa đơn theo tháng, năm và có thể lọc theo trạng thái nợ hay đã đóng',
  })
  @Get('bills')
  async getAllPayment(@Query() filterAndPagination: GetSummaryPaymentDto) {
    try {
      const { month, year, status, recordPerPage, page } = filterAndPagination;
      const bills = await this.feeService.getSummaryOfPayment(month, year, [
        status,
      ]);
      const totalRecord = bills.length;
      const totalPage = Math.ceil(totalRecord / recordPerPage);
      return {
        totalRecord,
        totalPage,
        paymentList: bills.slice(
          (page - 1) * recordPerPage,
          page * recordPerPage,
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary:
      'Tạo hóa đơn của tháng hiện tại, thông thường không cần API này do đã cài đặt lập lịch sắn trên server để tạo tự động hóa đơn',
  })
  @Post('bills')
  async createBills() {
    try {
      await this.feeService.createBills();
      return;
    } catch (error) {
      if (error instanceof CreateFail)
        throw new ConflictException(ErrorMessage.BILL_EXIST);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Thêm nộp tiền cho căn hộ',
  })
  @Patch('bills/:apartmentId')
  async addPayment(
    @Param('apartmentId') apartmentId: string,
    @Body() data: AddPaymentDto,
  ) {
    try {
      const { month, year, payMoney, payerName } = data;
      return await this.feeService.addPayment(
        apartmentId,
        payMoney,
        month,
        year,
        payerName,
      );
    } catch (error) {
      if (error instanceof FailResult)
        throw new BadRequestException(error.message);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Chỉnh sửa đơn giá khoản phí (chỉ dành cho quả lý)',
  })
  @UseGuards(RoleAuthGuard)
  @RolesDecor([Role.MANAGER])
  @Patch(':id')
  async updateFee(@Param('id') id: string, @Body() data: UpdateFeeDto) {
    try {
      return await this.feeService.updateFee(id, data);
    } catch (error) {
      throw error;
    }
  }
}
