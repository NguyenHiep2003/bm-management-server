import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateHouseholderDto {
  @ApiProperty({ description: 'Id chủ hộ mới' })
  @IsString()
  @IsNotEmpty()
  newHouseholderId: string;

  @ApiProperty({ description: 'Mối quan hệ của chủ hộ cũ với chủ hộ mới' })
  @IsString()
  @IsNotEmpty()
  newRelation: string;
}
