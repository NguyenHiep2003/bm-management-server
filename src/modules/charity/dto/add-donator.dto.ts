import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AddDonateDto {
  @ApiProperty({
    description: 'Mã cư dân',
    example: '0298e16e-9ef8-4a70-9f2a-80e15554948f',
  })
  @IsString()
  @IsNotEmpty()
  peopleId: string;

  @ApiProperty({
    description: 'Số tiền đóng góp',
    minimum: 1,
    example: '100000',
  })
  @IsPositive()
  amount: number;
}
