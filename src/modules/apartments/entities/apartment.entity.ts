import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ApartmentType } from 'src/utils/enums/attribute/apartment-type';
import { Owner } from './owner.entity';
import { People } from 'src/modules/people/entities/people.entity';
@Entity()
export class Apartment {
  @PrimaryColumn()
  apartmentId: string;

  @Column('real')
  area: number;

  @Column({ enum: ApartmentType })
  type: ApartmentType;

  @ManyToOne(() => Owner, (owner) => owner.apartments, { cascade: true })
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @OneToMany(() => People, (people) => people.apartment, {
    cascade: ['insert'],
  })
  people: People[];
}
