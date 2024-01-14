import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FeeUnit } from 'src/utils/enums/attribute/fee-unit';
export class BillDto {
  @ApiProperty({ description: 'Số hiệu căn hộ', example: '301' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({ description: 'Thành tiền', example: '50000' })
  @IsPositive()
  amount: number;
}
export class CreateBillsDto {
  @ApiProperty({
    description: 'Đơn giá',
    example: 9000,
    minimum: 1,
  })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Đơn vị',
    enum: [FeeUnit.BLOCK, FeeUnit.INDEX, FeeUnit.MONTH],
    example: FeeUnit.BLOCK,
  })
  @IsEnum([FeeUnit.BLOCK, FeeUnit.INDEX, FeeUnit.MONTH])
  unit: FeeUnit.BLOCK | FeeUnit.INDEX | FeeUnit.MONTH;

  @ApiProperty({ description: 'Tháng', minimum: 1, maximum: 12, example: 11 })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: 'Năm', minimum: 1, example: 2023 })
  @IsInt()
  @IsPositive()
  year: number;

  @ApiProperty({ type: [BillDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BillDto)
  bills: BillDto[];
}
