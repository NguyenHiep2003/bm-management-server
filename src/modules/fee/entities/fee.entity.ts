import { BaseEntity } from 'src/share/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Fee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  unitPrice: number;

  @Column()
  isOptional: boolean;
}
