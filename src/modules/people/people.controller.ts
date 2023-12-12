import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PeopleService } from './people.service';
import { UserDecor } from 'src/utils/decorators/user.decorator';
import { Public } from 'src/utils/decorators/public.decorator';
import { RolesDecor } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';

@Controller('api/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}
  @Post()
  async addPeople(@Body() peopleData) {
    return await this.peopleService.insertPeople(peopleData);
  }
  @RolesDecor([Role.ADMIN, Role.MANAGER])
  @UseGuards(RoleAuthGuard)
  @Get()
  sayHello(@UserDecor() user) {
    return user;
    return 'Hello';
  }
}
