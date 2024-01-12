import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class GetFeeOfApartmentQueryDto {
  @ApiProperty({ description: 'Tháng', minimum: 1, maximum: 12, example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: 'Năm', minimum: 1, example: 2023 })
  @IsInt()
  @IsPositive()
  year: number;
}
