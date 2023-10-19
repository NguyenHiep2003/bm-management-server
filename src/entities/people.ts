import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Gender } from 'src/enums/attribute/gender';
import { Apartment } from './apartment';

@Entity()
export class People extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  peopleId: number;

  @Column()
  name: string;

  @Column()
  nation: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  phoneNumber: string;

  @Column()
  homeTown: string;

  @Column()
  permanentAddress: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  apartments: Apartment[];
}
