import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base';
import { People } from './people';
@Entity()
export class Apartment extends BaseEntity {
  @PrimaryColumn()
  apartmentId: number;

  @Column('real')
  area: number;

  @ManyToOne(() => People, (people) => people.apartments, { cascade: true })
  @JoinColumn({ name: 'peopleId' })
  people: People;
}
