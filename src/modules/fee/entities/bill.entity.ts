import { Apartment } from 'src/modules/apartments/entities/apartment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fee } from './fee.entity';
import { BillStatus } from 'src/utils/enums/attribute/bill-status';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Apartment, (apartment) => apartment.bills)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @Column()
  apartmentId: string;

  @Column({ default: new Date().getMonth() + 1 })
  month: number;

  @Column({ default: new Date().getFullYear() })
  year: number;

  @ManyToOne(() => Fee, (fee) => fee.bills)
  @JoinColumn({ name: 'feeId' })
  fee: Fee;

  @Column()
  feeId: string;

  @Column()
  amount: number;

  @Column({ enum: BillStatus, default: BillStatus.DEBT })
  status: BillStatus;

  @Column({ default: null })
  payDay: Date;

  @Column({ default: null })
  payerName: string;

  @Column({ nullable: true })
  billCollector: string;
}
