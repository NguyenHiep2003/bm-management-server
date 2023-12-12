import { IsEmail } from 'class-validator';

export class CreateManagerAccountDto {
  @IsEmail()
  email: string;
}
