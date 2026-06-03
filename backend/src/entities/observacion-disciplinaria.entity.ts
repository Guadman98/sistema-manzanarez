import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum CategoriaDisciplinaria {
  LEVE = 'LEVE',
  GRAVE = 'GRAVE',
  CONVIVENCIA = 'CONVIVENCIA',
}

@Entity('observaciones_disciplinarias')
export class ObservacionDisciplinaria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'docente_id' })
  docente: User;

  @Column({ type: 'date' })
  fecha_incidente: string;

  @Column({
    type: 'enum',
    enum: CategoriaDisciplinaria,
  })
  categoria: CategoriaDisciplinaria;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ default: 'REGISTRADO' })
  estado: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
