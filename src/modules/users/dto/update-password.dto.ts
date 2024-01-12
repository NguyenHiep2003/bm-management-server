import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Email muốn tạo tài khoản',
    example: 'dsadasdadas',
  })
  @MinLength(8)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Email muốn tạo tài khoản',
    example: 'dsadasddadad',
  })
  @MinLength(8)
  @IsString()
  newPassword: string;
}
