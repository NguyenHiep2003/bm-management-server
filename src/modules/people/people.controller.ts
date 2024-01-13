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
import { UpdateHouseholderDto } from './dto/update-householder.dto';
import { FeeService } from '../fee/fee.service';
import { getRatio } from 'src/utils/getRatioOnDay';

@ApiTags('people')
@ApiBearerAuth()
@Controller()
export class PeopleController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly feeService: FeeService,
  ) {}
  @ApiOperation({ summary: 'Đăng ký cư trú' })
  @Post()
  async registerResidence(@Body() data: RegisterResidenceDto) {
    try {
      const { apartmentId, isCreateHousehold } = data;
      delete data.isCreateHousehold;
      const citizenId = data.citizenId;
      if (citizenId) {
        const people = await this.peopleService.getOnePeopleWithFilter({
          citizenId,
        });
        if (people)
          throw new ConflictException(ErrorMessage.EXIST_PEOPLE_CITIZEN_ID);
      }
      const checkExistHousehold =
        await this.peopleService.checkExistHousehold(apartmentId);
      if (isCreateHousehold) {
        if (checkExistHousehold)
          throw new ConflictException(ErrorMessage.CANT_REGISTER_HOUSEHOLDER);
        const householder: CreatePeople = {
          ...data,
          relationWithHouseholder: RelationType.HOUSEHOLDER,
        };
        await this.peopleService.saveOnePeople(householder);
        const date = new Date().getDate();
        if (date <= 5 || date >= 25) return;
        await this.feeService.createBillForNewHousehold(
          apartmentId,
          getRatio(date),
        );
      } else {
        if (!checkExistHousehold)
          throw new BadRequestException(ErrorMessage.HOUSEHOLD_NOT_FOUND);
        await this.peopleService.saveOnePeople(data);
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
      const isExistDebtBill =
        await this.feeService.checkExistDebtBill(apartmentId);
      if (isExistDebtBill)
        throw new BadRequestException(ErrorMessage.EXIST_DEBT);
      return await this.peopleService.deleteHousehold(apartmentId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Thay đổi chủ hộ của 1 hộ gia đình',
  })
  @Patch('household/:apartmentId')
  async changeHouseholder(
    @Param('apartmentId') apartmentId: string,
    @Body() data: UpdateHouseholderDto,
  ) {
    try {
      const newHouseholder = await this.peopleService.findPeopleById(
        data.newHouseholderId,
      );
      if (newHouseholder.apartmentId !== apartmentId)
        throw new BadRequestException(ErrorMessage.BAD_REQUEST);
      newHouseholder.relationWithHouseholder = RelationType.HOUSEHOLDER;
      const oldHouseholder =
        await this.peopleService.getHouseholderInApartmentId(apartmentId);
      oldHouseholder.relationWithHouseholder = data.newRelation;
      await this.peopleService.saveManyPeople(newHouseholder, oldHouseholder);
      return;
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
    summary: 'Lấy thông tin chi tiết 1 nhân khẩu bằng Id',
  })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.peopleService.findPeopleById(id);
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
      const res = await this.peopleService.updateOne(id, data);
      if (res.affected === 0)
        throw new BadRequestException(ErrorMessage.CANNOT_CHANGE_RELATION);
      return;
    } catch (error) {
      throw error;
    }
  }
}
