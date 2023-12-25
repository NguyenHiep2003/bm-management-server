import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { RolesDecor } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';
import { EntityNotFound } from 'src/shared/custom/fail-result.custom';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/custom/pagination.query';

@ApiTags('apartments')
@ApiBearerAuth()
@Controller()
@UseGuards(RoleAuthGuard)
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}
  @ApiOperation({ summary: 'Tạo căn hộ mới' })
  @UseGuards(RoleAuthGuard)
  @RolesDecor([Role.MANAGER])
  @Post()
  async createApartment(@Body() data: CreateApartmentDto) {
    try {
      const existApartment = await this.apartmentService.findApartmentWithId(
        data.apartmentId,
      );
      if (existApartment)
        throw new BadRequestException(ErrorMessage.EXIST_APARTMENT);
      return this.apartmentService.saveApartment(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách tất cả các hộ' })
  @Get()
  async getAllApartment(@Query() query: PaginationQuery) {
    try {
      const { page, recordPerPage } = query;
      const [apartmentList, totalRecord] =
        await this.apartmentService.getDetailsAllApartments(
          page,
          recordPerPage,
        );
      const totalPage = Math.ceil(totalRecord / recordPerPage);
      return { totalRecord, totalPage, apartmentList };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Thay đổi chủ sở hữu' })
  @Patch('/:apartmentId/owner')
  async updateOwner(
    @Param('apartmentId') apartmentId: string,
    @Body() data: UpdateOwnerDto,
  ) {
    try {
      await this.apartmentService.updateOwner(apartmentId, data);
      return;
    } catch (error) {
      if (error instanceof EntityNotFound)
        throw new NotFoundException(error.message);
      throw error;
    }
  }
}
