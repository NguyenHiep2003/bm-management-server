import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/modules/people/people.entity';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  imports: [TypeOrmModule.forFeature([People])],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
