import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    try {
      const userId = this.authService.validateUser(email, password);
      return { id: userId };
    } catch (error) {
      throw error;
    }
  }
}
