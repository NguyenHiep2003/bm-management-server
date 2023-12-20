import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { RolesDecor } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';
import { UpdateFeeDto } from './dto/update-fee.dto';

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

  @Patch(':id')
  async updateFee(@Param('id') id: string, @Body() data: UpdateFeeDto) {
    try {
      return await this.feeService.updateFee(id, data);
    } catch (error) {
      throw error;
    }
  }
}
