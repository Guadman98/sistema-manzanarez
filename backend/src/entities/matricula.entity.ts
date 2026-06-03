import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Grado } from './grado.entity';

@Entity('matriculas')
@Unique(['estudiante', 'ano_lectivo'])
export class Matricula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: User;

  @ManyToOne(() => Grado, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'grado_id' })
  grado: Grado;

  @Column({ type: 'int' })
  ano_lectivo: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
