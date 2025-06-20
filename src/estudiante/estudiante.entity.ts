/* eslint-disable prettier/prettier */
import { BaseEntity } from 'src/common/entities/base.entity';
import { Grado } from 'src/grado/grado.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Estudiante extends BaseEntity {
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
  fecha_nacimiento: Date;

  @Column()
  hashed_password: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ default: 'Activo' })
  estatus: string;

  @ManyToOne(() => Grado, (grado) => grado.estudiantes)
  grado: Grado;
}
