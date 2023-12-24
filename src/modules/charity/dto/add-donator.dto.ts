import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AddDonateDto {
  @ApiProperty({ description: 'Số hiệu căn hộ', example: '101' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({ description: 'Tên người ủng hộ', example: 'Nguyễn Phúc Hiệp' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  donatorName: string;

  @ApiProperty({
    description: 'Số tiền đóng góp',
    minimum: 1,
    example: '100000',
  })
  @IsPositive()
  amount: number;
}
