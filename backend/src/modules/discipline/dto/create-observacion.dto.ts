import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { CategoriaDisciplinaria } from '../../../entities/observacion-disciplinaria.entity';

export class CreateObservacionDto {
  @IsString()
  @IsNotEmpty()
  estudiante_id: string;

  @IsString()
  @IsNotEmpty()
  fecha_incidente: string; // Formato: YYYY-MM-DD

  @IsEnum(CategoriaDisciplinaria)
  @IsNotEmpty()
  categoria: CategoriaDisciplinaria;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
