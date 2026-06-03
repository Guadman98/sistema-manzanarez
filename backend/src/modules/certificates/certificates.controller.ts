import { Controller, Get, Post, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { SolicitarCertificadoDto } from './dto/solicitar-certificado.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  // --- ENDPOINT PÚBLICO (SIN JWT) ---
  @Get('verify/:codigo')
  verificarCertificado(@Param('codigo') codigo: string) {
    return this.certificatesService.verificar(codigo);
  }

  // --- ENDPOINTS PROTEGIDOS ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  solicitar(@Req() req: any, @Body() dto: SolicitarCertificadoDto) {
    return this.certificatesService.solicitar(req.user.id, dto);
  }

  @Post(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  aprobar(@Param('id') id: string) {
    return this.certificatesService.aprobar(id);
  }

  @Get('estudiante/:estudianteId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  findStudentCertificados(@Req() req: any, @Param('estudianteId') estudianteId: string) {
    if (req.user.role === Role.STUDENT && req.user.id !== estudianteId) {
      throw new ForbiddenException('No tienes permisos para ver las solicitudes de otro estudiante.');
    }
    return this.certificatesService.findStudentCertificados(estudianteId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.certificatesService.findAll();
  }
}
