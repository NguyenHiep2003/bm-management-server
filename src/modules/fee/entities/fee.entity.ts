import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Bill } from './bill.entity';
import { FeeUnit } from 'src/utils/enums/attribute/fee-unit';
import { FeeName, ThirdPartyFeeName } from 'src/utils/enums/attribute/fee-name';

const feeName = [
  FeeName.CAR,
  FeeName.MANAGEMENT,
  FeeName.MOTORBIKE,
  FeeName.SERVICE,
  ThirdPartyFeeName.ELECTRICITY_FEE,
  ThirdPartyFeeName.INTERNET_FEE,
  ThirdPartyFeeName.WATER_FEE,
];
@Entity()
export class Fee extends BaseEntity {
  @Column({ enum: feeName })
  name: FeeName | ThirdPartyFeeName;

  @Column()
  price: number;

  @Column({ enum: FeeUnit })
  unit: FeeUnit;

  bills: Bill[];
}
