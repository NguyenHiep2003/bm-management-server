import { UserService } from '../users/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneWithEmail(email);
      if (!user) return;
      const isCorrectPass = await this.userService.checkPassword(
        password,
        user.password,
      );
      if (!isCorrectPass) return;
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
