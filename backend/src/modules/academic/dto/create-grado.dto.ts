import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGradoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
