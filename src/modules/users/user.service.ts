import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generate } from 'generate-password';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/utils/enums/attribute/role';
import { compare, genSalt, hash } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  generatePassword(): string {
    return generate({ length: 8, numbers: true });
  }
  async checkPassword(password: string, hashedPassword: string) {
    try {
      return await compare(password, hashedPassword);
    } catch (error) {
      console.log('🚀 ~ UserService ~ checkPassword ~ error:', error);
      throw error;
    }
  }

  async saveUser(
    email: string,
    hashedPassword: string,
    role: Role,
    peopleId?: string,
  ) {
    try {
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        role,
        peopleId,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      console.log('🚀 ~ UserService ~ saveUser ~ error:', error);
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

  async deleteUser(id: string) {
    try {
      return await this.userRepository.delete({ id });
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
  async getBaseAdminInfo() {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.people', 'people')
        .select(['people.name', 'people.apartmentId', 'user.email'])
        .where('user.role = :role', { role: 'Thành viên ban quản trị' })
        .getMany();
    } catch (error) {
      console.log('🚀 ~ UserService ~ getBaseAdminInfo ~ error:', error);
      throw error;
    }
  }
  async getProfile(id: string) {
    try {
      return await this.userRepository.findOne({
        where: { id },
        relations: { people: true },
      });
    } catch (error) {
      console.log('🚀 ~ UserService ~ getProfile ~ error:', error);
      throw error;
    }
  }
}
