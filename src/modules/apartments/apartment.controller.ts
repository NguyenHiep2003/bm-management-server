import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { ErrorMessage } from 'src/utils/enums/message/exception';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { SuccessMessage } from 'src/utils/enums/message/success';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { RolesDecor } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';

@Controller()
@RolesDecor([Role.MANAGER])
@UseGuards(RoleAuthGuard)
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}
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
  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @Get()
  async getAllApartment() {
    try {
      return await this.apartmentService.getDetailsAllApartments();
    } catch (error) {
      throw error;
    }
  }
  @Patch('/:apartmentId/owner')
  async updateOwner(
    @Param('apartmentId') apartmentId: string,
    @Body() data: UpdateOwnerDto,
  ) {
    try {
      await this.apartmentService.updateOwner(apartmentId, data);
      return { message: SuccessMessage.UPDATE_SUCCESSFULLY };
    } catch (error) {
      throw error;
    }
  }
}
