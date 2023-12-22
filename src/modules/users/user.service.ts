import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generate } from 'generate-password';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { PeopleService } from '../people/people.service';
import { Role } from 'src/utils/enums/attribute/role';
import { ErrorMessage } from 'src/utils/enums/message/exception';
import { compare, genSalt, hash } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly peopleService: PeopleService,
  ) {}
  generatePassword(): string {
    return generate({ length: 8, numbers: true });
  }
  async checkPassword(password: string, hashedPassword: string) {
    try {
      return await compare(password, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
  async saveManager(email: string, hashedPassword: string, role: Role) {
    try {
      const account = this.userRepository.create({
        email,
        password: hashedPassword,
        role,
      });
      return await this.userRepository.save(account);
    } catch (error) {
      console.log('🚀 ~ AccountService ~ saveManagerAccount ~ error:', error);
      throw error;
    }
  }
  async saveAdmin(peopleId: string, hashedPassword: string, role: Role) {
    try {
      const people = await this.peopleService.findPeopleById(peopleId);
      if (!people) throw new BadRequestException(ErrorMessage.PEOPLE_NOT_FOUND);
      const { email } = people;
      const existEmail = await this.findOneWithEmail(email);
      if (!email) throw new BadRequestException(ErrorMessage.REQUIRED_EMAIL);
      if (existEmail) throw new BadRequestException(ErrorMessage.EXIST_EMAIL);
      const existAccount = await this.userRepository.findOne({
        where: { peopleId },
      });
      if (existAccount)
        throw new BadRequestException(ErrorMessage.PEOPLE_ALREADY_HAVE_ACCOUNT);
      const account = this.userRepository.create({
        email,
        password: hashedPassword,
        role,
        people,
      });
      console.log(account);
      return await this.userRepository.save(account);
    } catch (error) {
      console.log('🚀 ~ AccountService ~ saveAdminAccount ~ error:', error);
      throw error;
    }
  }
  async findOneWithEmail(email: string) {
    try {
      return this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.log('🚀 ~ AccountService ~ findOneWithEmail ~ error:', error);
      throw error;
    }
  }
  async findOneWithId(id: string) {
    try {
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.log('🚀 ~ UserService ~ findOneWithId ~ error:', error);
      throw error;
    }
  }
  async hashPassword(password: string) {
    try {
      const salt = await genSalt(8);
      const hashedPassword = await hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.log('🚀 ~ UserService ~ hashPassword ~ error:', error);
      throw error;
    }
  }
  async updatePassword(user: User, newHashedPass: string) {
    try {
      user.password = newHashedPass;
      return await this.userRepository.save(user);
    } catch (error) {
      console.log('🚀 ~ UserService ~ updatePassword ~ error:', error);
      throw error;
    }
  }

  async deleteAccount(id: string) {
    try {
      return await this.userRepository.softDelete({ id });
    } catch (error) {
      console.log('🚀 ~ UserService ~ deleteAccount ~ error:', error);
      throw error;
    }
  }

  async getAdmin() {
    try {
      return await this.userRepository.find({
        where: { role: Role.ADMIN },
        relations: { people: true },
        select: ['id', 'createdAt', 'email', 'role', 'people'],
      });
    } catch (error) {
      console.log('🚀 ~ UserService ~ getAdmin ~ error:', error);
      throw error;
    }
  }
}
