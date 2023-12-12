import { compare } from 'bcrypt';
import { UserService } from '../users/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessage } from 'src/utils/enums/error-message/exception';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async checkPassword(password: string, hashedPassword: string) {
    try {
      return await compare(password, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneWithEmail(email);
      if (!user) throw new UnauthorizedException(ErrorMessage.WRONG_CREDENTIAL);
      const isCorrectPass = await this.checkPassword(password, user.password);
      if (!isCorrectPass)
        throw new UnauthorizedException(ErrorMessage.WRONG_CREDENTIAL);
      return user.id;
    } catch (error) {
      console.log('🚀 ~ AuthService ~ validateUser ~ error:', error);
      throw error;
    }
  }
  generateToken(payload: IJwtPayload) {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      console.log('🚀 ~ AuthService ~ generateToken ~ error:', error);
      throw error;
    }
  }
}
