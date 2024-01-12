import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOwnerDto {
  @ApiProperty({ description: 'Tên chủ sở hữu', example: 'Nguyễn Phúc Hiệp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Quốc tịch', example: 'Việt Nam' })
  @IsString()
  @IsNotEmpty()
  nation: string;

  @ApiProperty({ description: 'Ngày sinh', example: '2003-11-30' })
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ description: 'Số căn cước công dân', example: '001203056789' })
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0122122131' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'Địa chỉ thường trú',
    example: 'Tiểu khu Đường, Phú Minh, Phú Xuyên, Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  permanentAddress: string;
}
