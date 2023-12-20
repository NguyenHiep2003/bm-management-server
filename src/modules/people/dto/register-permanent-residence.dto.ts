import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  Equals,
  IsArray,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import { Gender } from 'src/utils/enums/attribute/gender';
import { RelationType } from 'src/utils/enums/attribute/householder';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';

export class PermanentHouseHolderInfo {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nation: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @IsString()
  @IsNotEmpty()
  ethnic: string;

  @IsString()
  @IsNotEmpty()
  religion: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  homeTown: string;

  @IsString()
  @IsNotEmpty()
  permanentAddress: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  career: string;

  @Equals(ResidencyStatus.PERMANENT_RESIDENCE)
  status: ResidencyStatus;

  @IsString()
  @IsNotEmpty()
  @Equals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}

export class PermanentNonHouseholderInfo extends OmitType(
  PermanentHouseHolderInfo,
  ['relationWithHouseholder', 'citizenId'],
) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @IsString()
  @IsNotEmpty()
  @NotEquals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}
export class RegisterPermanentResidenceDto {
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PermanentHouseHolderInfo)
  householder: PermanentHouseHolderInfo;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PermanentNonHouseholderInfo)
  others: PermanentNonHouseholderInfo[];
}
