import { IsBoolean, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateFeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  unitPrice: number;

  @IsBoolean()
  isOptional: boolean;
}
