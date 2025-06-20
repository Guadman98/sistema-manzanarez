import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pago extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_estudiante: number;

  @Column()
  monto: number;

  @Column()
  fecha_pago: string;

  @Column()
  concepto: string;

  @Column({ default: 'Pendiente' })
  estado: string;
}
