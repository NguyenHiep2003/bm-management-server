import { Module } from '@nestjs/common';
import { FeeModule } from '../fee/fee.module';
import { PeopleModule } from '../people/people.module';
import { GuestController } from './guest.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [FeeModule, PeopleModule, UserModule],
  controllers: [GuestController],
})
export class GuestModule {}
