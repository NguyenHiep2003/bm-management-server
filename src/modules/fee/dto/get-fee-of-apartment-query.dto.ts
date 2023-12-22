import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class GetFeeOfApartmentQueryDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @IsPositive()
  year: number;
}
