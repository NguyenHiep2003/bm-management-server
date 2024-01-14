import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AddSinglePaymentDto {
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
