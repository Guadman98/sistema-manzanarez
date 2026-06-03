import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Grado } from './grado.entity';
import { Asignatura } from './asignatura.entity';

@Entity('planes_estudio')
@Unique(['grado', 'asignatura'])
export class PlanEstudio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grado, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'grado_id' })
  grado: Grado;

  @ManyToOne(() => Asignatura, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
