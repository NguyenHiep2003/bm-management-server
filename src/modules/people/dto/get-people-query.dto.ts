import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePeopleInfo } from './register-residence.dto';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetPeopleQueryDto extends PartialType(BasePeopleInfo) {
  @ApiProperty({ description: 'Số hiệu trang', minimum: 1, example: 1 })
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    description: 'Số bản ghi một trang',
    minimum: 1,
    example: 20,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  recordPerPage: number;

  @ApiPropertyOptional({
    description: 'Mã căn hộ',
    example: '101',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apartmentId: string;
}
