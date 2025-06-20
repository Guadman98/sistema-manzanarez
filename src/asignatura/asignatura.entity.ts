/* eslint-disable prettier/prettier */
import { BaseEntity } from 'src/common/entities/base.entity';
import { Grado } from 'src/grado/grado.entity';
import { Profesor } from 'src/profesor/profesor.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Asignatura extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Profesor, (profesor) => profesor.asignaturas)
  profesor: Profesor;

  @ManyToMany(() => Grado, (grado) => grado.asignaturas)
  grados: Grado[];
}
