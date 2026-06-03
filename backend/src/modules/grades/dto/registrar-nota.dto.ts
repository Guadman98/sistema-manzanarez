import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class RegistrarNotaDto {
  @IsString()
  @IsNotEmpty()
  estudiante_id: string;

  @IsString()
  @IsNotEmpty()
  asignatura_id: string;

  @IsString()
  @IsNotEmpty()
  periodo_id: string;

  @IsNumber()
  @Min(0.0)
  @Max(5.0)
  nota_original: number;
}
