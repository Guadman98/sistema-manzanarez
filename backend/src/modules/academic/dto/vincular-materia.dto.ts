import { IsNotEmpty, IsString } from 'class-validator';

export class VincularMateriaDto {
  @IsString()
  @IsNotEmpty()
  grado_id: string;

  @IsString()
  @IsNotEmpty()
  asignatura_id: string;
}
