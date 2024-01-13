import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive } from 'class-validator';
import { FeeName } from 'src/utils/enums/attribute/fee-name';
import { FeeUnit } from 'src/utils/enums/attribute/fee-unit';
export class CreateFeeDto {
  @ApiProperty({
    description: 'Tên khoản phí',
    example: FeeName.MOTORBIKE,
    enum: FeeName,
  })
  @IsEnum(FeeName)
  name: FeeName;

  @ApiProperty({
    description: 'Đơn giá',
    example: 9000,
    minimum: 1,
  })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Đơn vị',
    enum: FeeUnit,
    example: FeeUnit.MONTH,
  })
  @IsEnum(FeeUnit)
  unit: FeeUnit;
}
