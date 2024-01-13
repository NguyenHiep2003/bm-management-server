import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/custom/pagination.query';
import { FeeService } from '../fee/fee.service';
import { PeopleService } from '../people/people.service';
import { ErrorMessage } from 'src/utils/enums/message/error';

@ApiTags('vehicle')
@ApiBearerAuth()
@Controller()
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly feeService: FeeService,
    private readonly peopleService: PeopleService,
  ) {}
  @ApiOperation({ summary: 'Thêm mới đăng ký gửi xe cho cư dân' })
  @Post()
  async createVehicle(@Body() data: CreateVehicleDto) {
    try {
      const { ownerId, type, numberPlate } = data;
      const vehicle = await this.vehicleService.getOne(numberPlate);
      if (vehicle) throw new ConflictException(ErrorMessage.VEHICLE_EXIST);
      const people = await this.peopleService.findPeopleById(ownerId);
      if (!people) throw new BadRequestException(ErrorMessage.PEOPLE_NOT_FOUND);
      await this.vehicleService.createVehicle(data);
      await this.feeService.createBillForNewVehicle(people.apartmentId, type);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Lấy danh sách các phương tiện đăng ký gửi, có phân trang',
  })
  @Get()
  async getAllVehicle(@Query() query: PaginationQuery) {
    try {
      const [vehicleList, totalRecord] =
        await this.vehicleService.getVehicleDetails(
          query.recordPerPage,
          query.page,
        );
      const totalPage = Math.ceil(totalRecord / query.recordPerPage);
      return { totalRecord, totalPage, vehicleList };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Xóa phương tiện có biển số cung cấp' })
  @Delete(':numberPlate')
  async deleteOne(@Param('numberPlate') numberPlate: string) {
    try {
      return await this.vehicleService.deleteOne(numberPlate);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Lấy thông tin của phương tiện có biển số được cung cấp',
  })
  @Get(':numberPlate')
  async getOne(@Param('numberPlate') numberPlate: string) {
    try {
      return await this.vehicleService.getOne(numberPlate);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Lấy danh sách các phương tiện đăng ký của hộ gia đình',
  })
  @Get('/findByHousehold/:apartmentId')
  async getVehicleOfHousehold(@Param('apartmentId') apartmentId: string) {
    try {
      return await this.vehicleService.getVehicleOfHousehold(apartmentId);
    } catch (error) {
      throw error;
    }
  }
}
