import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../entities/base';
import { Gender } from 'src/utils/enums/attribute/gender';
import { Apartment } from '../../entities/apartment';

@Entity()
export class People extends BaseEntity {
  @Column()
  name: string;

  @Column()
  nation: string;

  @Column('date')
  dateOfBirth: Date;

  @Column()
  ethnic: string;

  @Column()
  religion: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  homeTown: string;

  @Column()
  permanentAddress: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  apartments: Apartment[];

  @OneToOne(() => People)
  @JoinColumn()
  lastModifyBy: People;
}
