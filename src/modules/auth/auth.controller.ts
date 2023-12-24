import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDecor } from 'src/shared/decorators/user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
@ApiTags('auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Đăng nhập' })
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
