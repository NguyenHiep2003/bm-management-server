import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/utils/enums/attribute/role';
import { RolesDecor } from 'src/shared/decorators/roles.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDecor } from 'src/shared/decorators/user.decorator';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { User } from './user.entity';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailSubject } from 'src/utils/mail-content/subject';
import { MailText } from 'src/utils/mail-content/text';
import { TypeORMError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PeopleService } from '../people/people.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly peopleService: PeopleService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Tạo user mới' })
  @UseGuards(RoleAuthGuard)
  @RolesDecor([Role.MANAGER])
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    try {
      const { role, email } = body;
      const password: string = this.userService.generatePassword();
      const user = await this.userService.findOneWithEmail(email);
      if (user) throw new ConflictException(ErrorMessage.EXIST_EMAIL);
      switch (role) {
        case Role.MANAGER: {
          const hashedPassword = await this.userService.hashPassword(password);
          await this.userService.saveUser(email, hashedPassword, role);
          break;
        }
        case Role.ADMIN: {
          if (!body.peopleId)
            throw new BadRequestException(ErrorMessage.PEOPLE_ID_REQUIRED);
          const { peopleId } = body;
          const people = await this.peopleService.findPeopleById(peopleId);
          if (people?.email != email)
            throw new BadRequestException(ErrorMessage.EMAIL_NOT_MATCH);
          const hashedPassword = await this.userService.hashPassword(password);
          await this.userService.saveUser(
            email,
            hashedPassword,
            role,
            peopleId,
          );
          break;
        }
        default:
          return;
      }
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get('mail.user'),
        subject: MailSubject.ON_CREATE_ACCOUNT,
        text: `${MailText.ON_CREATE_ACCOUNT}${password}`,
      });
      return;
    } catch (error) {
      if (!(error instanceof TypeORMError) && !(error instanceof HttpException))
        console.log('🚀 ~ UserController ~ createManager ~ error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Đổi mật khẩu' })
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
      return;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Xóa 1 user' })
  @UseGuards(RoleAuthGuard)
  @RolesDecor([Role.MANAGER])
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách thành viên ban quản trị' })
  @Get()
  async getAdmin() {
    try {
      return await this.userService.getAdmin();
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Lấy thông tin đầy đủ của người dùng' })
  @Get('/profile')
  async getProfile(@UserDecor('id') id: string) {
    try {
      return await this.userService.getProfile(id);
    } catch (error) {
      throw error;
    }
  }
}
