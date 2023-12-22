import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AddPaymentDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  year: number;

  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @IsNumber()
  @IsPositive()
  payMoney: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  payerName: string;
}
