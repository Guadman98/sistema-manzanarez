import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  documento_identidad: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
