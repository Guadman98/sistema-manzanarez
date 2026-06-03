import { IsOptional, IsBoolean } from 'class-validator';

export class UpdatePeriodoDto {
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsBoolean()
  @IsOptional()
  cerrado?: boolean;
}
