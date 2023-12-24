import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionalFeeDto {
  @ApiProperty({
    description: 'Tên khoản từ thiện',
    example: 'Quỹ trẻ em nghèo',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ngày bắt đầu',
    example: '2024-01-01',
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc',
    example: '2024-03-01',
  })
  @IsDate()
  endDate: Date;
}
