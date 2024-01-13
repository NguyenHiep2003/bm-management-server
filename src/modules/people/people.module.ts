import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/modules/people/entities/people.entity';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { ApartmentModule } from '../apartments/apartment.module';
import { TemporaryAbsent } from './entities/temporary-absent.entity';
import { User } from '../users/user.entity';
import { FeeModule } from '../fee/fee.module';
import { Vehicle } from '../vehicles/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([People, TemporaryAbsent, User, Vehicle]),
    ApartmentModule,
    FeeModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
