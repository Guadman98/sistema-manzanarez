import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { documento_identidad, password } = loginDto;
    
    const user = await this.usersService.findByDocument(documento_identidad);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales incorrectas o usuario inactivo.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const payload = { 
      sub: user.id, 
      documento_identidad: user.documento_identidad, 
      role: user.role 
    };

    const token = this.jwtService.sign(payload);

    const userResponse = { ...user };
    delete (userResponse as any).password_hash;

    return {
      user: userResponse,
      access_token: token,
    };
  }
}
