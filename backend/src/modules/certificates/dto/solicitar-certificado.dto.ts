import { IsNotEmpty, IsEnum } from 'class-validator';
import { TipoCertificado } from '../../../entities/certificado.entity';

export class SolicitarCertificadoDto {
  @IsEnum(TipoCertificado)
  @IsNotEmpty()
  tipo: TipoCertificado;
}
