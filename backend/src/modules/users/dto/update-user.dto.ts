import { IsString, IsOptional, IsEmail, IsEnum, Length, IsBoolean } from 'class-validator';
import { Role } from '../../../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  fecha_nacimiento?: string;

  @IsString()
  @IsOptional()
  nombre_acudiente?: string;

  @IsString()
  @IsOptional()
  telefono_acudiente?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  @Length(6, 50)
  password?: string;
}
