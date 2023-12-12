import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interface/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }
  async validate(payload: IJwtPayload) {
    try {
      return this.userService.findOneWithId(payload.id);
    } catch (error) {
      console.log('🚀 ~ JwtAuthStrategy ~ validate ~ error:', error);
      throw error;
    }
  }
}
