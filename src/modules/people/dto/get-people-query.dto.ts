import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePeopleInfo } from './register-residence.dto';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPeopleQueryDto extends PartialType(BasePeopleInfo) {
  @ApiPropertyOptional({ description: 'Số hiệu trang', minimum: 0, example: 0 })
  @IsOptional()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({
    description: 'Số bản ghi một trang',
    minimum: 1,
    example: 5,
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  recordPerPage: number;
}
