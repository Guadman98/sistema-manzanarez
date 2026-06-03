import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class RegistrarNivelacionDto {
  @IsNumber()
  @Min(0.0)
  @Max(5.0)
  @IsNotEmpty()
  nota_nivelacion: number;
}
