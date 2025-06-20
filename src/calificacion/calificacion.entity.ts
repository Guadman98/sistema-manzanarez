import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Calificacion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_estudiante: number;

  @Column()
  id_grado: number;

  @Column()
  nota: string;

  @Column()
  fecha_evaluacion: Date;

  @Column()
  tipo_evaluacion: string;
}
