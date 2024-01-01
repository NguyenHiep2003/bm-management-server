import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePeople, PeopleFilter, PeopleService } from './people.service';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { UpdatePeopleInfoDto } from './dto/update-people.dto';
import { RegisterTemporaryAbsentDto } from './dto/register-temporary-absent.dto';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';
import { RegisterResidenceDto } from './dto/register-residence.dto';
import {
  EntityNotFound,
  UpdateFail,
} from 'src/shared/custom/fail-result.custom';
import { GetPeopleQueryDto } from './dto/get-people-query.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/custom/pagination.query';
import { RelationType } from 'src/utils/enums/attribute/householder';

@ApiTags('people')
@ApiBearerAuth()
@Controller()
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}
  @ApiOperation({ summary: 'Đăng ký cư trú' })
  @Post()
  async registerResidence(@Body() data: RegisterResidenceDto) {
    try {
      const { apartmentId, isCreateHousehold } = data;
      delete data.isCreateHousehold;
      const checkExistHousehold =
        await this.peopleService.checkExistHousehold(apartmentId);
      if (isCreateHousehold) {
        if (checkExistHousehold)
          throw new ConflictException(ErrorMessage.CANT_REGISTER_HOUSEHOLDER);
        const householder: CreatePeople = {
          ...data,
          relationWithHouseholder: RelationType.HOUSEHOLDER,
        };
        await this.peopleService.savePeople(householder);
      } else {
        if (!checkExistHousehold)
          throw new BadRequestException(ErrorMessage.HOUSEHOLD_NOT_FOUND);
        await this.peopleService.savePeople(data);
      }
      return;
    } catch (error) {
      if (error instanceof EntityNotFound)
        throw new BadRequestException(error.message);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Đăng ký tạm vắng cho cư dân có Id' })
  @Post(':id/registerAbsent')
  async registerAbsentTemporary(
    @Param('id') id: string,
    @Body() data: RegisterTemporaryAbsentDto,
  ) {
    try {
      const { reason, startDate, endDate, destinationAddress } = data;
      const previousStatus = await this.peopleService.updateResidencyStatus(
        id,
        ResidencyStatus.TEMPORARILY_ABSENT,
      );
      return await this.peopleService.createTemporaryAbsent(
        id,
        reason,
        startDate,
        endDate,
        destinationAddress,
        previousStatus,
      );
    } catch (error) {
      switch (true) {
        case error instanceof EntityNotFound:
          throw new NotFoundException(error.message);
        case error instanceof UpdateFail:
          throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách các nhân khẩu tạm vắng' })
  @Get('absentList')
  async getAbsentList(@Query() query: PaginationQuery) {
    try {
      const [absentList, totalRecord] = await this.peopleService.getAbsentList(
        query.recordPerPage,
        query.page,
      );
      const totalPage = Math.ceil(totalRecord / query.recordPerPage);
      return { totalRecord, totalPage, absentList };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Khôi phục tình trạng cư trú khi kết thúc tạm vắng',
  })
  @Patch(':id/rollbackStatus')
  async rollbackStatusAfterAbsent(@Param('id') peopleId: string) {
    try {
      return await this.peopleService.rollbackStatusAfterAbsent(peopleId);
    } catch (error) {
      if (error instanceof EntityNotFound)
        throw new NotFoundException(error.message);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Lấy danh sách nhân khẩu trong căn hộ có Id là apartmentId',
  })
  @Get('household/:apartmentId')
  async getHouseholdOfApartment(@Param('apartmentId') apartmentId: string) {
    try {
      return await this.peopleService.getHouseholdWithId(apartmentId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Xóa tất cả nhân khẩu trong căn hộ có Id là apartmentId',
  })
  @Delete('household/:apartmentId')
  async deleteAllPeopleInHousehold(@Param('apartmentId') apartmentId: string) {
    try {
      return await this.peopleService.deleteHousehold(apartmentId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Lấy danh sách các nhân khẩu, có hỗ trợ phân trang và lọc',
  })
  @Get()
  async getAllPeople(@Query() query: GetPeopleQueryDto) {
    try {
      const { page, recordPerPage } = query;
      delete query.page;
      delete query.recordPerPage;
      const [peopleList, totalRecord] =
        await this.peopleService.getAllPeopleWithFilter(
          page,
          recordPerPage,
          query as PeopleFilter,
        );
      const totalPage = Math.ceil(totalRecord / recordPerPage);
      return { totalRecord, totalPage, peopleList };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Xóa một nhân khẩu (không thể xóa bằng cách này nếu đó là chủ hộ)',
  })
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      const result = await this.peopleService.deletePeopleById(id);
      if (!result)
        throw new BadRequestException(
          ErrorMessage.CANNOT_DELETE_HOUSEHOLDER_THIS_WAY,
        );
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Thay đổi thông tin nhân khẩu',
  })
  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() data: UpdatePeopleInfoDto) {
    try {
      return await this.peopleService.updateOne(id, data);
    } catch (error) {
      throw error;
    }
  }
}
