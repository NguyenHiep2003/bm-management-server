import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDecor } from 'src/utils/decorators/user.decorator';
import { Public } from 'src/utils/decorators/public.decorator';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserDecor('id') userId: string) {
    try {
      const token = this.authService.generateToken({ id: userId });
      return { accessToken: token };
    } catch (error) {
      throw error;
    }
  }
}
