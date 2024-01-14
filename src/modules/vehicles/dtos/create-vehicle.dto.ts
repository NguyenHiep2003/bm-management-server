import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { VehicleType } from 'src/utils/enums/attribute/vehicle-type';

export class CreateVehicleDto {
  @ApiProperty({ example: '29Y7-123.45', description: 'Biển số xe' })
  @IsString()
  @IsNotEmpty()
  numberPlate: string;

  @ApiProperty({ description: 'Mã số chủ sở hữu' })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({
    description: 'Xe máy',
    enum: VehicleType,
    example: VehicleType.MOTORBIKE,
  })
  @IsEnum(VehicleType)
  type: VehicleType;
}
