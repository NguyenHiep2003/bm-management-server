import { IsEnum, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { GetFeeOfApartmentQueryDto } from './get-fee-of-apartment-query.dto';
import { BillStatus } from 'src/utils/enums/attribute/bill-status';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetSummaryPaymentDto extends GetFeeOfApartmentQueryDto {
  @ApiPropertyOptional({
    enum: BillStatus,
    description: 'Trạng thái của hóa đơn',
  })
  @IsOptional()
  @IsEnum(BillStatus)
  status: BillStatus;

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
