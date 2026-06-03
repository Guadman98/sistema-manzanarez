import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Asignatura } from './asignatura.entity';
import { Periodo } from './periodo.entity';

@Entity('calificaciones_periodo')
@Unique(['estudiante', 'asignatura', 'periodo'])
export class CalificacionPeriodo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: User;

  @ManyToOne(() => Asignatura, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @ManyToOne(() => Periodo, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'periodo_id' })
  periodo: Periodo;

  @Column({ type: 'float' })
  nota_original: number;

  @Column({ type: 'float', nullable: true })
  nota_nivelacion: number | null;

  @Column({ default: false })
  es_nota_final: boolean;

  @CreateDateColumn()
  fecha_registro: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
