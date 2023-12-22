import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class RegisterTemporaryAbsentDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  destinationAddress: string;
}
