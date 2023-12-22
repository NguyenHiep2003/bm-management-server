import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AddDonateDto {
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  donatorName: string;

  @IsString()
  @IsNotEmpty()
  optionalFeeId: string;

  @IsPositive()
  amount: number;
}
