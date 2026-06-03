import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { PlanEstudio } from './plan-estudio.entity';

@Entity('asignaciones_docentes')
@Unique(['docente', 'planEstudio'])
export class AsignacionDocente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'docente_id' })
  docente: User;

  @ManyToOne(() => PlanEstudio, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'plan_estudio_id' })
  planEstudio: PlanEstudio;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
