import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { People } from '../people/entities/people.entity';
import { Role } from 'src/utils/enums/attribute/role';
import { BaseEntity } from 'src/share/base.entity';
@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: Role;

  @OneToOne(() => People)
  @JoinColumn({ name: 'peopleId' })
  people: People;

  @Column({ nullable: true })
  peopleId: string;
}
