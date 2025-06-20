import { Asignatura } from 'src/asignatura/asignatura.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Profesor } from 'src/profesor/profesor.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Estudiante)
  estudiante: Estudiante;

  @ManyToOne(() => Asignatura)
  materia: Asignatura;

  @ManyToOne(() => Profesor)
  profesor: Profesor;

  @Column()
  anio_escolar: number;
}
