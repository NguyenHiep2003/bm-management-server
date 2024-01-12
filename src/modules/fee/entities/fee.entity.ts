import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Bill } from './bill.entity';

@Entity()
export class Fee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  unitPrice: number;

  bills: Bill[];
}
