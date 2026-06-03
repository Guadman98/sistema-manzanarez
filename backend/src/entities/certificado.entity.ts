import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum TipoCertificado {
  ESTUDIO = 'ESTUDIO',
  NOTAS = 'NOTAS',
}

export enum EstadoCertificado {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
}

@Entity('certificados')
export class Certificado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: User;

  @Column({
    type: 'enum',
    enum: TipoCertificado,
  })
  tipo: TipoCertificado;

  @Column({ unique: true, nullable: true })
  codigo_verificacion: string;

  @Column({
    type: 'enum',
    enum: EstadoCertificado,
    default: EstadoCertificado.PENDIENTE,
  })
  estado: EstadoCertificado;

  @CreateDateColumn()
  fecha_solicitud: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_aprobacion: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
