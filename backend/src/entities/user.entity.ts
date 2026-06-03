import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  documento_identidad: string;

  @Column()
  password_hash: string;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: string;

  @Column({ nullable: true })
  nombre_acudiente: string;

  @Column({ nullable: true })
  telefono_acudiente: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
