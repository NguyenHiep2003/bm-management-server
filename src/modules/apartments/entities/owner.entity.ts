import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/share/base.entity';
import { Apartment } from './apartment.entity';

@Entity()
export class Owner extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  nation: string;

  @Column('date')
  dateOfBirth: Date;

  @Column()
  citizenId: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: false })
  permanentAddress: string;

  apartments: Apartment[];
}
