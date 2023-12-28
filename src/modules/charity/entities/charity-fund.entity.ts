import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OptionalFee } from './optional-fee.entity';
import { People } from 'src/modules/people/entities/people.entity';

@Entity()
export class CharityFund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OptionalFee, (optionalFee) => optionalFee.charityFund)
  @JoinColumn({ name: 'optionalFeeId' })
  optionalFee: OptionalFee;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  optionalFeeId: string;

  @ManyToOne(() => People, (people) => people.charityFund)
  @JoinColumn({ name: 'peopleId' })
  people: People;

  @Column()
  peopleId: string;

  @Column()
  amount: number;
}
