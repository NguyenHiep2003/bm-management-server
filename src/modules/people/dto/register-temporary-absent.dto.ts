import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class RegisterTemporaryAbsentDto {
  @ApiProperty({
    description: 'Lý do đăng ký tạm vắng',
    example: 'Đi nghĩa vụ',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Ngày bắt đầu',
    example: '2024-01-01',
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc',
    example: '2026-01-01',
  })
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Nơi đến',
    example: 'Xã A, ...',
  })
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;
}
