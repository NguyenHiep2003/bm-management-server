import { IsEnum, IsOptional } from 'class-validator';
import { GetFeeOfApartmentQueryDto } from './get-fee-of-apartment-query.dto';
import { BillStatus } from 'src/utils/enums/attribute/bill-status';

export class GetSummaryPaymentDto extends GetFeeOfApartmentQueryDto {
  @IsOptional()
  @IsEnum(BillStatus)
  status: BillStatus;
}
