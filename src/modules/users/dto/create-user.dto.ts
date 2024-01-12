import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from 'src/utils/enums/attribute/role';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email muốn tạo tài khoản',
    example: 'hihihaha@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description:
      'Id của cư dân được làm thành viên ban quản trị, nếu tạo mới quản lý thì không cần trường này',
  })
  @IsOptional()
  @IsUUID()
  peopleId: string;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
}
