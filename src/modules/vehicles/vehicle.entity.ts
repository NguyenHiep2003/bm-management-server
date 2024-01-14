import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { People } from '../people/entities/people.entity';
import { VehicleType } from 'src/utils/enums/attribute/vehicle-type';

@Entity()
export class Vehicle {
  @PrimaryColumn()
  numberPlate: string;

  @ManyToOne(() => People, (people) => people.vehicles)
  @JoinColumn({ name: 'ownerId' })
  owner: People;

  @Column()
  ownerId: string;

  @Column({ enum: VehicleType })
  type: VehicleType;
}
