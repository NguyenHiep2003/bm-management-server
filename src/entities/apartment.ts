import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base';
import { People } from '../modules/people/people.entity';
@Entity()
export class Apartment extends BaseEntity {
  @PrimaryColumn()
  apartmentId: number;

  @Column('real')
  area: number;

  @Column('bit')
  type: boolean;

  @ManyToOne(() => People, (people) => people.apartments, { cascade: true })
  @JoinColumn({ name: 'ownerId' })
  owner: People;
}
