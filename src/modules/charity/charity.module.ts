import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharityFund } from './entities/charity-fund.entity';
import { OptionalFee } from './entities/optional-fee.entity';
import { CharityController } from './charity.controller';
import { CharityService } from './charity.service';
import { PeopleModule } from '../people/people.module';

@Module({
  imports: [TypeOrmModule.forFeature([CharityFund, OptionalFee]), PeopleModule],
  controllers: [CharityController],
  providers: [CharityService],
})
export class CharityModule {}
