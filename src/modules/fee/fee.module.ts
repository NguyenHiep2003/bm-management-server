import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fee } from './entities/fee.entity';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { Bill } from './entities/bill.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fee, Bill, User])],
  providers: [FeeService],
  controllers: [FeeController],
  exports: [FeeService],
})
export class FeeModule {}
