import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateManagerAccountDto } from './dto/create-manager.dto';
import { Role } from 'src/utils/enums/attribute/role';
import { CreateAdminAccountDto } from './dto/create-admin.dto';
import { RolesDecor } from 'src/utils/decorators/roles.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDecor } from 'src/utils/decorators/user.decorator';
import { ErrorMessage } from 'src/utils/enums/message/exception';
import { SuccessMessage } from 'src/utils/enums/message/success';
import { User } from './user.entity';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @RolesDecor([Role.MANAGER])
  @UseGuards(RoleAuthGuard)
  @Post('manager')
  async createManager(@Body() body: CreateManagerAccountDto) {
    try {
      const user = await this.userService.findOneWithEmail(body.email);
      if (user) throw new BadRequestException(ErrorMessage.EXIST_EMAIL);
      const password = this.userService.generatePassword();
      const hashedPassword = await this.userService.hashPassword(password);
      const newUser = await this.userService.saveManager(
        body.email,
        hashedPassword,
        Role.MANAGER,
      );
      return { ...newUser, password };
    } catch (error) {
      throw error;
    }
  }
  @RolesDecor([Role.MANAGER])
  @UseGuards(RoleAuthGuard)
  @Post('admin')
  async createAdmin(@Body() body: CreateAdminAccountDto) {
    try {
      const password = this.userService.generatePassword();
      const hashedPassword = await this.userService.hashPassword(password);
      const user = await this.userService.saveAdmin(
        body.peopleId,
        hashedPassword,
        Role.ADMIN,
      );
      return { ...user, password };
    } catch (error) {
      throw error;
    }
  }
  @Patch('password')
  async changePassword(
    @Body() body: UpdatePasswordDto,
    @UserDecor() user: User,
  ) {
    try {
      const isCorrectPass = await this.userService.checkPassword(
        body.password,
        user.password,
      );
      if (!isCorrectPass)
        throw new BadRequestException(ErrorMessage.WRONG_PASSWORD);
      const newHashedPass = await this.userService.hashPassword(
        body.newPassword,
      );
      await this.userService.updatePassword(user, newHashedPass);
      return { message: SuccessMessage.UPDATE_SUCCESSFULLY };
    } catch (error) {
      throw error;
    }
  }

  @RolesDecor([Role.MANAGER])
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      return await this.userService.deleteAccount(id);
    } catch (error) {
      throw error;
    }
  }
}
