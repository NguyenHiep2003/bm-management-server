import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { FeeService } from '../fee/fee.service';
import { PeopleService } from '../people/people.service';
import { GetBillDto } from './dto/get-bill.dto';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('guest')
@Public()
@Controller()
export class GuestController {
  constructor(
    private readonly feeService: FeeService,
    private readonly peopleService: PeopleService,
  ) {}
  @ApiOperation({ summary: 'Allow guests find their bill' })
  @Get('bill')
  async getBill(@Query() filter: GetBillDto) {
    try {
      const people = await this.peopleService.getOnePeopleWithFilter(filter);
      if (!people) throw new BadRequestException(ErrorMessage.BAD_REQUEST);
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return await this.feeService.getAllBillsOfAnApartment(
        filter.apartmentId,
        month,
        year,
      );
    } catch (error) {
      throw error;
    }
  }
}
