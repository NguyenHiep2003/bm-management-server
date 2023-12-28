import { Module } from '@nestjs/common';
import { FeeModule } from '../fee/fee.module';
import { PeopleModule } from '../people/people.module';
import { GuestController } from './guest.controller';

@Module({ imports: [FeeModule, PeopleModule], controllers: [GuestController] })
export class GuestModule {}
