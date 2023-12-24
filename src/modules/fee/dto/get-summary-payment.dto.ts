import { IsEnum, IsOptional } from 'class-validator';
import { GetFeeOfApartmentQueryDto } from './get-fee-of-apartment-query.dto';
import { BillStatus } from 'src/utils/enums/attribute/bill-status';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSummaryPaymentDto extends GetFeeOfApartmentQueryDto {
  @ApiPropertyOptional({
    enum: BillStatus,
    description: 'Trạng thái của hóa đơn',
  })
  @IsOptional()
  @IsEnum(BillStatus)
  status: BillStatus;
}
