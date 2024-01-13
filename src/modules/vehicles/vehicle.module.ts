import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { FeeModule } from '../fee/fee.module';
import { PeopleModule } from '../people/people.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), FeeModule, PeopleModule],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
