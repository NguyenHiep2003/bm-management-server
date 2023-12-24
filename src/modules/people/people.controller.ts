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
import { PeopleFilter, PeopleService } from './people.service';
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

@ApiTags('people')
@ApiBearerAuth()
@Controller()
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}
  @ApiOperation({ summary: 'Đăng ký cư trú' })
  @Post()
  async registerResidence(@Body() data: RegisterResidenceDto) {
    try {
      const { apartmentId, status } = data;
      let householder: unknown, others: unknown[];
      switch (status) {
        case ResidencyStatus.PERMANENT_RESIDENCE: {
          householder = data.permanentRegister.householder;
          others = data.permanentRegister.others;
          break;
        }
        case ResidencyStatus.TEMPORARY_RESIDENCE: {
          householder = data.temporaryRegister.householder;
          others = data.temporaryRegister.others;
          break;
        }
        default:
          throw new BadRequestException();
      }
      const createNewHousehold = householder ? true : false;
      const household =
        await this.peopleService.getHouseholdWithId(apartmentId);
      if (createNewHousehold) {
        if (household.length !== 0)
          throw new BadRequestException(ErrorMessage.CANT_REGISTER_HOUSEHOLDER);
        const allMember = others ? [householder, ...others] : [householder];
        const newHousehold = await this.peopleService.createHousehold(
          apartmentId,
          allMember,
        );
        if (!newHousehold)
          throw new ConflictException(ErrorMessage.APARTMENT_NOT_FOUND);
      } else {
        if (household.length === 0)
          throw new BadRequestException(ErrorMessage.HOUSEHOLD_NOT_FOUND);
        const newHousehold = await this.peopleService.addPeopleToHousehold(
          apartmentId,
          others,
        );
        if (!newHousehold)
          throw new ConflictException(ErrorMessage.APARTMENT_NOT_FOUND);
      }
      return;
    } catch (error) {
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
  async getAbsentList() {
    try {
      return await this.peopleService.getAbsentList();
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
      return this.peopleService.getAllPeopleWithFilter(
        page,
        recordPerPage,
        query as PeopleFilter,
      );
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
