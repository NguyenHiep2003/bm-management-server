import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { FeeModule } from '../fee/fee.module';

@Module({ imports: [FeeModule], providers: [TaskService] })
export class TaskModule {}
