import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessage } from 'src/utils/enums/message/error';
@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    try {
      const userId = await this.authService.validateUser(email, password);
      if (!userId)
        throw new UnauthorizedException(ErrorMessage.WRONG_CREDENTIAL);
      return { id: userId };
    } catch (error) {
      throw error;
    }
  }
}
