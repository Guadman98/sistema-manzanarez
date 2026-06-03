import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, Length } from 'class-validator';
import { Role } from '../../../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  documento_identidad: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional()
  fecha_nacimiento?: string;

  @IsString()
  @IsOptional()
  nombre_acudiente?: string;

  @IsString()
  @IsOptional()
  telefono_acudiente?: string;
}
