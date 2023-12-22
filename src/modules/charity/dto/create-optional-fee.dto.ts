import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionalFeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
