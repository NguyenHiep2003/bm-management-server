import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
