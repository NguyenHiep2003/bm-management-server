import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { People } from './people.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';

@Entity()
export class TemporaryAbsent extends BaseEntity {
  @ManyToOne(() => People, (people) => people.temporaryAbsent)
  @JoinColumn({ name: 'peopleId' })
  people: People;

  @Column()
  peopleId: string;

  @Column()
  reason: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  destinationAddress: string;

  @Column({ enum: ResidencyStatus })
  previousStatus: ResidencyStatus;
}
