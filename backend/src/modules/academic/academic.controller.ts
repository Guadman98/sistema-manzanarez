import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateGradoDto } from './dto/create-grado.dto';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { MatricularEstudianteDto } from './dto/matricular-estudiante.dto';
import { VincularMateriaDto } from './dto/vincular-materia.dto';
import { AsignarDocenteDto } from './dto/asignar-docente.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';

@Controller('academic')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // --- GRADOS ---
  @Post('grados')
  @Roles(Role.ADMIN)
  createGrado(@Body() createGradoDto: CreateGradoDto) {
    return this.academicService.createGrado(createGradoDto);
  }

  @Get('grados')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAllGrados() {
    return this.academicService.findAllGrados();
  }

  @Get('grados/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOneGrado(@Param('id') id: string) {
    return this.academicService.findOneGrado(id);
  }

  // --- ASIGNATURAS ---
  @Post('asignaturas')
  @Roles(Role.ADMIN)
  createAsignatura(@Body() createAsignaturaDto: CreateAsignaturaDto) {
    return this.academicService.createAsignatura(createAsignaturaDto);
  }

  @Get('asignaturas')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAllAsignaturas() {
    return this.academicService.findAllAsignaturas();
  }

  // --- PLAN DE ESTUDIOS (VINCULAR MATERIAS) ---
  @Post('planes')
  @Roles(Role.ADMIN)
  vincularMateria(@Body() dto: VincularMateriaDto) {
    return this.academicService.vincularMateria(dto);
  }

  @Get('planes')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAllPlanes() {
    return this.academicService.findAllPlanesEstudio();
  }

  @Get('planes/grado/:gradoId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findPlanesByGrado(@Param('gradoId') gradoId: string) {
    return this.academicService.findPlanesEstudioByGrado(gradoId);
  }

  // --- MATRÍCULAS ---
  @Post('matriculas')
  @Roles(Role.ADMIN)
  matricularEstudiante(@Body() dto: MatricularEstudianteDto) {
    return this.academicService.matricularEstudiante(dto);
  }

  @Get('matriculas')
  @Roles(Role.ADMIN)
  findAllMatriculas() {
    return this.academicService.findAllMatriculas();
  }

  @Get('matriculas/estudiante/:estudianteId')
  @Roles(Role.ADMIN, Role.STUDENT)
  findMatriculaEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.academicService.findMatriculaEstudiante(estudianteId);
  }

  // --- ASIGNACIONES ---
  @Post('asignaciones')
  @Roles(Role.ADMIN)
  asignarDocente(@Body() dto: AsignarDocenteDto) {
    return this.academicService.asignarDocente(dto);
  }

  @Get('asignaciones')
  @Roles(Role.ADMIN)
  findAllAsignaciones() {
    return this.academicService.findAllAsignaciones();
  }

  @Get('asignaciones/docente/:docenteId')
  @Roles(Role.ADMIN, Role.TEACHER)
  findAsignacionesDocente(@Param('docenteId') docenteId: string) {
    return this.academicService.findAsignacionesDocente(docenteId);
  }
}
