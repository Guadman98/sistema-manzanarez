import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
