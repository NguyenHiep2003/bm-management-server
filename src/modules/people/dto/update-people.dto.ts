import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePeopleInfo } from './register-residence.dto';
import { IsNotEmpty, IsOptional, IsString, NotEquals } from 'class-validator';
import { RelationType } from 'src/utils/enums/attribute/householder';

export class UpdatePeopleInfoDto extends PartialType(BasePeopleInfo) {
  @ApiPropertyOptional({
    description: 'Quan hệ với chủ hộ (không được là "Chủ hộ")',
    example: 'Con đẻ',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @NotEquals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}
