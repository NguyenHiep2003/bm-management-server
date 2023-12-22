import {
  BadRequestException,
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
import { PeopleService } from './people.service';
import { UserDecor } from 'src/utils/decorators/user.decorator';
import { RolesDecor } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { ErrorMessage } from 'src/utils/enums/message/exception';
import { RegisterPermanentResidenceDto } from './dto/register-permanent-residence.dto';
import { RegisterTemporaryResidenceDto } from './dto/register-temporary-residence';
import { UpdatePeopleInfoDto } from './dto/update-people.dto';
import { RegisterTemporaryAbsentDto } from './dto/register-temporary-absent.dto';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';

@Controller()
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}
  @Post('registerPermanent')
  async registerPermanent(@Body() data: RegisterPermanentResidenceDto) {
    try {
      const { householder, others, apartmentId } = data;
      if (!householder && !others)
        throw new BadRequestException(
          ErrorMessage.MUST_CONTAIN_AT_LEAST_ONE_PEOPLE,
        );
      const household =
        await this.peopleService.getHouseholdWithId(apartmentId);
      const createNewHousehold = householder ? true : false;
      if (createNewHousehold) {
        if (household.length !== 0)
          throw new BadRequestException(ErrorMessage.CANT_REGISTER_HOUSEHOLDER);
        const allMember = others ? [...others, householder] : [householder];
        return await this.peopleService.createHousehold(apartmentId, allMember);
      } else {
        if (household.length === 0)
          throw new BadRequestException(ErrorMessage.HOUSEHOLD_NOT_FOUND);
        return await this.peopleService.addPeopleToHousehold(
          apartmentId,
          others,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('registerTemporary')
  async registerTemporary(@Body() data: RegisterTemporaryResidenceDto) {
    try {
      const { householder, others, apartmentId } = data;
      if (!householder && !others)
        throw new BadRequestException(
          ErrorMessage.MUST_CONTAIN_AT_LEAST_ONE_PEOPLE,
        );
      const household =
        await this.peopleService.getHouseholdWithId(apartmentId);
      const createNewHousehold = householder ? true : false;
      if (createNewHousehold) {
        if (household.length !== 0)
          throw new BadRequestException(ErrorMessage.CANT_REGISTER_HOUSEHOLDER);
        const allMember = others ? [...others, householder] : [householder];
        return await this.peopleService.createHousehold(apartmentId, allMember);
      } else {
        if (household.length === 0)
          throw new BadRequestException(ErrorMessage.HOUSEHOLD_NOT_FOUND);
        return await this.peopleService.addPeopleToHousehold(
          apartmentId,
          others,
        );
      }
    } catch (error) {
      throw error;
    }
  }

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
      throw error;
    }
  }
  @Get('absentList')
  async getAbsentList() {
    try {
      return await this.peopleService.getAbsentList();
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/rollbackStatus')
  async rollbackStatusAfterAbsent(@Param('id') peopleId: string) {
    try {
      return await this.peopleService.rollbackStatusAfterAbsent(peopleId);
    } catch (error) {
      throw error;
    }
  }

  @Get('household/:apartmentId')
  async getHouseholdOfApartment(@Param('apartmentId') apartmentId: string) {
    try {
      return await this.peopleService.getHouseholdWithId(apartmentId);
    } catch (error) {
      throw error;
    }
  }

  @Delete('household/:apartmentId')
  async deleteAllPeopleInHousehold(@Param('apartmentId') apartmentId: string) {
    try {
      return await this.peopleService.deleteHousehold(apartmentId);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAllPeople(
    @Query('page') page: number,
    @Query('recordPerPage') recordPerPage: number,
  ) {
    try {
      if (!Number.isInteger(page) || !Number.isInteger(recordPerPage))
        throw new BadRequestException();
      return this.peopleService.getAllPeople(page, recordPerPage);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      return this.peopleService.deletePeopleById(id);
    } catch (error) {
      throw error;
    }
  }
  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() data: UpdatePeopleInfoDto) {
    try {
      return await this.peopleService.updateOne(id, data);
    } catch (error) {
      throw error;
    }
  }

  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @UseGuards(RoleAuthGuard)
  @Get()
  sayHello(@UserDecor() user) {
    return user;
    return 'Hello';
  }
}
