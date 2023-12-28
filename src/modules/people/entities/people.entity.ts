import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Gender } from 'src/utils/enums/attribute/gender';
import { Apartment } from 'src/modules/apartments/entities/apartment.entity';
import { ResidencyStatus } from 'src/utils/enums/attribute/residency-status';
import { TemporaryAbsent } from './temporary-absent.entity';
import { CharityFund } from 'src/modules/charity/entities/charity-fund.entity';

@Entity()
export class People extends BaseEntity {
  @Column()
  name: string;

  @Column()
  nation: string;

  @Column('date')
  dateOfBirth: Date;

  @Column({ nullable: true })
  citizenId: string;

  @Column()
  ethnic: string;

  @Column()
  religion: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  homeTown: string;

  @Column()
  permanentAddress: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  career: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.people)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @Column()
  apartmentId: string;

  @Column({ type: 'enum', enum: ResidencyStatus })
  status: ResidencyStatus;

  @Column()
  relationWithHouseholder: string;

  temporaryAbsent: TemporaryAbsent[];

  charityFund: CharityFund[];
}
