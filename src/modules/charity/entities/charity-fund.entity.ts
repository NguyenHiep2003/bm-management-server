import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OptionalFee } from './optional-fee.entity';

@Entity()
export class CharityFund {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => OptionalFee, (optionalFee) => optionalFee.charityFund)
  @JoinColumn({ name: 'optionalFeeId' })
  optionalFee: OptionalFee;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  optionalFeeId: string;

  @Column()
  apartmentId: string;

  @Column()
  donatorName: string;

  @Column()
  amount: number;
}
