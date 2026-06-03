import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { CreateObservacionDto } from './dto/create-observacion.dto';
import { CategoriaDisciplinaria } from '../../entities/observacion-disciplinaria.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';

@Controller('discipline')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post()
  @Roles(Role.TEACHER)
  create(@Req() req: any, @Body() dto: CreateObservacionDto) {
    return this.disciplineService.create(req.user.id, dto);
  }

  @Get('estudiante/:estudianteId')
  @Roles(Role.ADMIN, Role.STUDENT)
  findStudentObservaciones(
    @Req() req: any,
    @Param('estudianteId') estudianteId: string,
    @Query('categoria') categoria?: CategoriaDisciplinaria,
  ) {
    if (req.user.role === Role.STUDENT && req.user.id !== estudianteId) {
      throw new ForbiddenException('No tienes permisos para ver el historial disciplinario de otro estudiante.');
    }
    return this.disciplineService.findStudentObservaciones(estudianteId, categoria);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('categoria') categoria?: CategoriaDisciplinaria) {
    return this.disciplineService.findAll(categoria);
  }
}
