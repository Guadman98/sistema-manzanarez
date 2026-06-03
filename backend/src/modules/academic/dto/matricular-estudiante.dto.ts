import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class MatricularEstudianteDto {
  @IsString()
  @IsNotEmpty()
  estudiante_id: string;

  @IsString()
  @IsNotEmpty()
  grado_id: string;

  @IsInt()
  @Min(2020)
  ano_lectivo: number;
}
