import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApartmentType } from 'src/utils/enums/attribute/apartment-type';

export class CreateApartmentDto {
  @ApiProperty({ description: 'Diện tích căn hộ', minimum: 0, example: 30 })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Số hiệu căn hộ', example: '301' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({ description: 'Loại căn hộ', enum: ApartmentType })
  @IsEnum(ApartmentType)
  type: ApartmentType;
}
