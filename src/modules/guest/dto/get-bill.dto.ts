import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetBillDto {
  @ApiProperty({ description: 'Số hiệu căn hộ', example: '101' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({
    description: 'Số căn cước người tra cứu',
    example: '001203045699',
  })
  @IsString()
  @IsNotEmpty()
  citizenId: string;
}
