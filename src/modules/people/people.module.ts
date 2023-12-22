import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/modules/people/entities/people.entity';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { ApartmentModule } from '../apartments/apartment.module';
import { TemporaryAbsent } from './entities/temporary-absent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([People, TemporaryAbsent]),
    ApartmentModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
