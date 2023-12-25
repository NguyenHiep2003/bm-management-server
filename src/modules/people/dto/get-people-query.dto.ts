import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BasePeopleInfo } from './register-residence.dto';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
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
}
