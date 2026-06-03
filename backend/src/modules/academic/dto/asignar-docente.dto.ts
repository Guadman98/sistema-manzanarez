import { IsNotEmpty, IsString } from 'class-validator';

export class AsignarDocenteDto {
  @IsString()
  @IsNotEmpty()
  docente_id: string;

  @IsString()
  @IsNotEmpty()
  plan_estudio_id: string;
}
