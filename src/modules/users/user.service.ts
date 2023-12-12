import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generate } from 'generate-password';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { PeopleService } from '../people/people.service';
import { Role } from 'src/utils/enums/attribute/role';
import { ErrorMessage } from 'src/utils/enums/error-message/exception';
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
  async saveManager(email: string, password: string, role: Role) {
    try {
      const account = this.userRepository.create({
        email,
        password,
        role,
      });
      return await this.userRepository.save(account);
    } catch (error) {
      console.log('🚀 ~ AccountService ~ saveManagerAccount ~ error:', error);
      throw error;
    }
  }
  async saveAdmin(peopleId: string, password: string, role: Role) {
    try {
      const people = await this.peopleService.findPeopleById(peopleId);
      const { email } = people;
      if (!email) throw new BadRequestException(ErrorMessage.REQUIRED_EMAIL);
      const account = this.userRepository.create({
        email,
        password,
        role,
        people,
      });
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
}
