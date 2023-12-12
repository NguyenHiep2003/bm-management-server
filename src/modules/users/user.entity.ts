import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { People } from '../people/people.entity';
import { genSalt, hash } from 'bcrypt';
import { Role } from 'src/utils/enums/attribute/role';
import { BaseEntity } from 'src/entities/base';
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

  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt(8);
    this.password = await hash(this.password, salt);
  }
}
