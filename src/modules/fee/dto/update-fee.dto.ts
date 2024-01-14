import { PickType } from '@nestjs/swagger';
import { CreateFeeDto } from './create-fee.dto';

export class UpdateFeeDto extends PickType(CreateFeeDto, ['price']) {}
