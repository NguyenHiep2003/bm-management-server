import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AddPaymentDto {
  @ApiProperty({
    description: 'Tháng của hóa đơn',
    minimum: 1,
    maximum: 12,
    example: 11,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Năm của hóa đơn',
    minimum: 1,
    example: 2023,
  })
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'Số tiền nộp',
    example: 200000,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  payMoney: number;

  @ApiProperty({
    description: 'Tên người nộp',
    example: 'Nguyễn Phúc Hiệp',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  payerName: string;
}
