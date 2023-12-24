import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeeService } from '../fee/fee.service';
import { CreateFail } from 'src/shared/custom/fail-result.custom';

@Injectable()
export class TaskService {
  constructor(private readonly feeService: FeeService) {}
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async createBillAndDeleteExpiredBillAtTheBeginningOfMonth() {
    try {
      await this.feeService.createBills();
      return await this.feeService.deleteBillAfterSixMonth();
    } catch (error) {
      if (error instanceof CreateFail) return;
      console.log(
        '🚀 ~ TaskService ~ createBillAtTheBeginningOfMonth ~ error:',
        error,
      );
    }
  }
}
