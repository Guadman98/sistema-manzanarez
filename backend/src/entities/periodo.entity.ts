import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('periodos')
export class Periodo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  numero: number; // Ej: 1, 2, 3, 4

  @Column()
  nombre: string; // Ej: 'Primer Periodo', 'Segundo Periodo'

  @Column({ type: 'int' })
  ano_lectivo: number; // Ej: 2026

  @Column({ default: false })
  activo: boolean; // Indica si el periodo está activo para el registro de calificaciones

  @Column({ default: false })
  cerrado: boolean; // Indica si el periodo ha sido cerrado y ya no admite modificaciones

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
