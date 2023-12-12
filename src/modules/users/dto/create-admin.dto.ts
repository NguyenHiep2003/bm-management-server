import { IsNumber } from 'class-validator';

export class CreateAdminAccountDto {
  @IsNumber()
  peopleId: string;
}
