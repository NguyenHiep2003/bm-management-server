import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { CharityFund } from './charity-fund.entity';

@Entity()
export class OptionalFee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  charityFund: CharityFund[];
}
