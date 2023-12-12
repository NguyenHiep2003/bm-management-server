import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateManagerAccountDto } from './dto/create-manager.dto';
import { Role } from 'src/utils/enums/attribute/role';
import { CreateAdminAccountDto } from './dto/create-admin.dto';

@Controller()
export class UserController {
  constructor(private readonly accountService: UserService) {}
  @Post('manager')
  async createManager(@Body() body: CreateManagerAccountDto) {
    try {
      const password = this.accountService.generatePassword();
      const account = await this.accountService.saveManager(
        body.email,
        password,
        Role.MANAGER,
      );
      return { ...account, password };
    } catch (error) {
      throw error;
    }
  }
  @Post('admin')
  async createAdmin(@Body() body: CreateAdminAccountDto) {
    try {
      const password = this.accountService.generatePassword();
      const account = await this.accountService.saveAdmin(
        body.peopleId,
        password,
        Role.ADMIN,
      );
      return { ...account, password };
    } catch (error) {
      throw error;
    }
  }
}
