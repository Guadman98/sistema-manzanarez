import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreatePeriodoDto {
  @IsInt()
  @Min(1)
  @Max(6)
  numero: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @Min(2020)
  ano_lectivo: number;
}
