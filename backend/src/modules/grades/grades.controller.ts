import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { RegistrarNotaDto } from './dto/registrar-nota.dto';
import { RegistrarNivelacionDto } from './dto/registrar-nivelacion.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // --- PERIODOS ---
  @Post('periodos')
  @Roles(Role.ADMIN)
  createPeriodo(@Body() dto: CreatePeriodoDto) {
    return this.gradesService.createPeriodo(dto);
  }

  @Get('periodos')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAllPeriodos() {
    return this.gradesService.findAllPeriodos();
  }

  @Get('periodos/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOnePeriodo(@Param('id') id: string) {
    return this.gradesService.findOnePeriodo(id);
  }

  @Put('periodos/:id')
  @Roles(Role.ADMIN)
  updatePeriodo(@Param('id') id: string, @Body() dto: UpdatePeriodoDto) {
    return this.gradesService.updatePeriodo(id, dto);
  }

  @Post('periodos/:id/cerrar')
  @Roles(Role.ADMIN)
  cerrarPeriodo(@Param('id') id: string) {
    return this.gradesService.cerrarPeriodo(id);
  }

  // --- CALIFICACIONES ---
  @Post('registrar')
  @Roles(Role.TEACHER)
  registrarNota(@Req() req: any, @Body() dto: RegistrarNotaDto) {
    return this.gradesService.registrarNota(req.user.id, dto);
  }

  @Post('nivelar/:calificacionId')
  @Roles(Role.TEACHER)
  registrarNivelacion(
    @Req() req: any,
    @Param('calificacionId') calificacionId: string,
    @Body() dto: RegistrarNivelacionDto,
  ) {
    return this.gradesService.registrarNivelacion(req.user.id, calificacionId, dto);
  }

  @Get('boletin/:estudianteId/:anoLectivo')
  @Roles(Role.ADMIN, Role.STUDENT)
  findNotasEstudiante(
    @Req() req: any,
    @Param('estudianteId') estudianteId: string,
    @Param('anoLectivo') anoLectivo: string,
  ) {
    if (req.user.role === Role.STUDENT && req.user.id !== estudianteId) {
      throw new ForbiddenException('No tienes permisos para consultar las calificaciones de otro estudiante.');
    }
    return this.gradesService.findNotasEstudiante(estudianteId, parseInt(anoLectivo, 10));
  }

  @Get('planilla/:planEstudioId')
  @Roles(Role.TEACHER)
  findPlanillaDocente(@Req() req: any, @Param('planEstudioId') planEstudioId: string) {
    return this.gradesService.findPlanillaDocente(req.user.id, planEstudioId);
  }
}
