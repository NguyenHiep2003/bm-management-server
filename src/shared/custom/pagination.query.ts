import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQuery {
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
