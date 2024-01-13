import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Bill } from './bill.entity';
import { FeeUnit } from 'src/utils/enums/attribute/fee-unit';
import { FeeName } from 'src/utils/enums/attribute/fee-name';

@Entity()
export class Fee extends BaseEntity {
  @Column({ enum: FeeName })
  name: FeeName;

  @Column()
  price: number;

  @Column({ enum: FeeUnit })
  unit: FeeUnit;

  bills: Bill[];
}
