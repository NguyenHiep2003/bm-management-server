import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApartmentType } from 'src/utils/enums/attribute/apartment-type';

export class CreateApartmentDto {
  @IsNumber()
  @Min(0)
  area: number;

  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @IsEnum(ApartmentType)
  type: ApartmentType;
}
