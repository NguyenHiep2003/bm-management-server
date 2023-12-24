import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
export class CreateFeeDto {
  @ApiProperty({
    description: 'Tên khoản phí',
    example: 'Phí dịch vụ',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Đơn giá',
    example: 9000,
    minimum: 1,
  })
  @IsPositive()
  unitPrice: number;
}
