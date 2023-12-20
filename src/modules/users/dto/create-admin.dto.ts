import { IsUUID } from 'class-validator';

export class CreateAdminAccountDto {
  @IsUUID()
  peopleId: string;
}
