import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Matricula extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_estudiante: number;

  @Column()
  id_grado: number;

  @Column()
  fecha_inscripcion: string;

  @Column({ default: 'Activo' })
  estado: string;
}
