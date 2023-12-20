import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(8)
  @IsString()
  password: string;

  @MinLength(8)
  @IsString()
  newPassword: string;
}
