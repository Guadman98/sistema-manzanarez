import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAsignaturaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
