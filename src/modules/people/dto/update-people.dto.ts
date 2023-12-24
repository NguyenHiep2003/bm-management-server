import { PartialType } from '@nestjs/swagger';
import { BasePeopleInfo } from './register-residence.dto';

export class UpdatePeopleInfoDto extends PartialType(BasePeopleInfo) {}
