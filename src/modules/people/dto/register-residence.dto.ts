import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  Equals,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  NotEquals,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Gender } from 'src/utils/enums/attribute/gender';
import { RelationType } from 'src/utils/enums/attribute/householder';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';

export class BasePeopleInfo {
  @ApiProperty({ description: 'Tên cư dân', example: 'Nguyễn Phúc Hiệp' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ description: 'Quốc tịch', example: 'Việt Nam' })
  @IsString()
  @IsNotEmpty()
  nation: string;

  @ApiProperty({ description: 'Ngày sinh', example: '2003-11-30' })
  @IsDate()
  dateOfBirth: Date;

  @ApiPropertyOptional({
    description: 'Mã số căn cước',
    example: '001203045678',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiProperty({ description: 'Dân tộc', example: 'Kinh' })
  @IsString()
  @IsNotEmpty()
  ethnic: string;

  @ApiProperty({ description: 'Tôn giáo', example: 'Không' })
  @IsString()
  @IsNotEmpty()
  religion: string;

  @ApiPropertyOptional({
    description: 'Số diện thoại',
    example: '0902345678',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'hahaha@gmail.com',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Quê quán',
    example: 'Thường tín, Phú Xuyên, Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  hometown: string;

  @ApiProperty({
    description: 'Địa chỉ thường trú',
    example: 'Phú Minh, Phú Xuyên, Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  permanentAddress: string;

  @ApiProperty({ description: 'Giới tính', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Nghề nghiệp',
    example: 'Sinh viên',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  career: string;
}
export class PermanentHouseHolderInfo extends OmitType(BasePeopleInfo, [
  'citizenId',
]) {
  @ApiProperty({
    description: 'Số căn cước công dân',
    example: '001203045678',
  })
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiProperty({
    description: 'Trạng thái cư trú',
    enum: [ResidencyStatus.PERMANENT_RESIDENCE],
  })
  @Equals(ResidencyStatus.PERMANENT_RESIDENCE)
  status: ResidencyStatus;

  @ApiProperty({
    description: 'Quan hệ với chủ hộ',
    enum: [RelationType.HOUSEHOLDER],
  })
  @IsString()
  @IsNotEmpty()
  @Equals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}

export class PermanentNonHouseholderInfo extends OmitType(
  PermanentHouseHolderInfo,
  ['relationWithHouseholder', 'citizenId'],
) {
  @ApiPropertyOptional({
    description: 'Số căn cước công dân',
    example: '09872312321',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiProperty({
    description: 'Quan hệ với chủ hộ (không được là "Chủ hộ")',
    example: 'Con đẻ',
  })
  @IsString()
  @IsNotEmpty()
  @NotEquals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}

export class TemporaryHouseHolderInfo extends OmitType(BasePeopleInfo, [
  'citizenId',
]) {
  @ApiProperty({
    description: 'Số căn cước công dân',
    example: '001203045678',
  })
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiProperty({
    description: 'Trạng thái cư trú',
    enum: [ResidencyStatus.TEMPORARY_RESIDENCE],
  })
  @Equals(ResidencyStatus.TEMPORARY_RESIDENCE)
  status: ResidencyStatus;

  @ApiProperty({
    description: 'Quan hệ với chủ hộ',
    enum: [RelationType.HOUSEHOLDER],
  })
  @IsString()
  @IsNotEmpty()
  @Equals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}

export class TemporaryNonHouseholderInfo extends OmitType(
  TemporaryHouseHolderInfo,
  ['relationWithHouseholder', 'citizenId'],
) {
  @ApiPropertyOptional({
    description: 'Số căn cước công dân',
    example: '09872312321',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiProperty({
    description: 'Quan hệ với chủ hộ (không được là "Chủ hộ")',
    example: 'Con đẻ',
  })
  @IsString()
  @IsNotEmpty()
  @NotEquals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}

export class PermanentRegister {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PermanentHouseHolderInfo)
  householder: PermanentHouseHolderInfo;

  @ApiPropertyOptional({ type: [PermanentNonHouseholderInfo] })
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PermanentNonHouseholderInfo)
  others: PermanentNonHouseholderInfo[];
}

export class TemporaryRegister {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TemporaryHouseHolderInfo)
  householder: TemporaryHouseHolderInfo;

  @ApiPropertyOptional({
    type: [TemporaryNonHouseholderInfo],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TemporaryNonHouseholderInfo)
  others: TemporaryNonHouseholderInfo[];
}

export class RegisterResidenceDto {
  @ApiProperty({
    description: 'Mã số căn hộ',
    example: '301',
  })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({
    description: 'Loại trạng thái cư trú muốn đăng ký',
    enum: [
      ResidencyStatus.PERMANENT_RESIDENCE,
      ResidencyStatus.TEMPORARY_RESIDENCE,
    ],
  })
  @IsIn([
    ResidencyStatus.PERMANENT_RESIDENCE,
    ResidencyStatus.TEMPORARY_RESIDENCE,
  ])
  status: ResidencyStatus;

  @ApiProperty({ description: 'Đăng ký lập hộ mới hay không?', example: true })
  @IsBoolean()
  isCreateHousehold: boolean;

  @ApiProperty({ description: 'Tên cư dân', example: 'Nguyễn Phúc Hiệp' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ description: 'Quốc tịch', example: 'Việt Nam' })
  @IsString()
  @IsNotEmpty()
  nation: string;

  @ApiProperty({ description: 'Ngày sinh', example: '2003-11-30' })
  @IsDate()
  dateOfBirth: Date;

  @ApiPropertyOptional({
    description: 'Mã số căn cước',
    example: '001203045678',
  })
  @ValidateIf((val) => val.isCreateHousehold === true)
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @ApiProperty({ description: 'Dân tộc', example: 'Kinh' })
  @IsString()
  @IsNotEmpty()
  ethnic: string;

  @ApiProperty({ description: 'Tôn giáo', example: 'Không' })
  @IsString()
  @IsNotEmpty()
  religion: string;

  @ApiPropertyOptional({
    description: 'Số diện thoại',
    example: '0902345678',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'hahaha@gmail.com',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Quê quán',
    example: 'Thường tín, Phú Xuyên, Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  hometown: string;

  @ApiProperty({
    description: 'Địa chỉ thường trú',
    example: 'Phú Minh, Phú Xuyên, Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  permanentAddress: string;

  @ApiProperty({ description: 'Giới tính', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    description: 'Nghề nghiệp',
    example: 'Sinh viên',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  career: string;

  @ApiPropertyOptional({
    description: 'Quan hệ với chủ hộ (không được là "Chủ hộ")',
    example: 'Con đẻ',
  })
  @ValidateIf((val) => val.isCreateHousehold === false)
  @IsString()
  @IsNotEmpty()
  @NotEquals(RelationType.HOUSEHOLDER)
  relationWithHouseholder: string;
}
