/* eslint-disable prettier/prettier */
import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn({ nullable: true })
  fecha_modificacion: Date;

  @Column({ nullable: true })
  usuario_creacion: string;

  @Column({ nullable: true })
  usuario_modificacion: string;
}
