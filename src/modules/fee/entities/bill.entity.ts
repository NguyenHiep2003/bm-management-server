import { Apartment } from 'src/modules/apartments/entities/apartment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Fee } from './fee.entity';
import { BillStatus } from 'src/utils/enums/attribute/bill-status';

@Entity()
export class Bill {
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Apartment, (apartment) => apartment.bills)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @PrimaryColumn()
  apartmentId: string;

  @PrimaryColumn({ default: new Date().getMonth() + 1 })
  month: number;

  @PrimaryColumn({ default: new Date().getFullYear() })
  year: number;

  @ManyToOne(() => Fee, (fee) => fee.bills)
  @JoinColumn({ name: 'feeId' })
  fee: Fee;

  @PrimaryColumn()
  feeId: string;

  @Column()
  amount: number;

  @Column({ enum: BillStatus, default: BillStatus.DEBT })
  status: BillStatus;

  @Column({ default: null })
  payDay: Date;

  @Column({ default: null })
  payerName: string;
}
