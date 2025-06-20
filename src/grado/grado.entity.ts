import { Asignatura } from 'src/asignatura/asignatura.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Grado extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_asignatura: number;

  @Column()
  id_profesor: number;

  @Column()
  horario: string;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.grado)
  estudiantes: Estudiante[];

  @ManyToMany(() => Asignatura, (asignatura) => asignatura.grados)
  @JoinTable()
  asignaturas: Asignatura[];
}
