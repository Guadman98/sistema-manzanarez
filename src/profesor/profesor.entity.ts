import { Asignatura } from 'src/asignatura/asignatura.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Profesor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  dni: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefono: string;

  @Column()
  especialidad: string;

  @Column()
  hashed_password: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ default: 'Activo' })
  estatus: string;

  @OneToMany(() => Asignatura, (asignatura) => asignatura.profesor)
  asignaturas: Asignatura[];
}
