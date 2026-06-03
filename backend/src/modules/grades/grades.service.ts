import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Periodo } from '../../entities/periodo.entity';
import { CalificacionPeriodo } from '../../entities/calificacion-periodo.entity';
import { AcademicService } from '../academic/academic.service';
import { UsersService } from '../users/users.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { RegistrarNotaDto } from './dto/registrar-nota.dto';
import { RegistrarNivelacionDto } from './dto/registrar-nivelacion.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Periodo)
    private readonly periodoRepo: Repository<Periodo>,
    @InjectRepository(CalificacionPeriodo)
    private readonly calificacionRepo: Repository<CalificacionPeriodo>,
    private readonly academicService: AcademicService,
    private readonly usersService: UsersService,
  ) {}

  // --- PERIODOS ---
  async createPeriodo(dto: CreatePeriodoDto): Promise<Periodo> {
    const { numero, nombre, ano_lectivo } = dto;
    const exists = await this.periodoRepo.findOne({
      where: { numero, ano_lectivo },
    });
    if (exists) {
      throw new ConflictException(`El periodo número ${numero} para el año ${ano_lectivo} ya existe.`);
    }

    const periodo = this.periodoRepo.create({
      numero,
      nombre,
      ano_lectivo,
      activo: false,
      cerrado: false,
    });
    return this.periodoRepo.save(periodo);
  }

  async findAllPeriodos(): Promise<Periodo[]> {
    return this.periodoRepo.find({ order: { ano_lectivo: 'DESC', numero: 'ASC' } });
  }

  async findOnePeriodo(id: string): Promise<Periodo> {
    const periodo = await this.periodoRepo.findOne({ where: { id } });
    if (!periodo) {
      throw new NotFoundException(`Periodo con ID '${id}' no encontrado.`);
    }
    return periodo;
  }

  async updatePeriodo(id: string, dto: UpdatePeriodoDto): Promise<Periodo> {
    const periodo = await this.findOnePeriodo(id);
    
    if (dto.activo === true) {
      await this.periodoRepo.update({ ano_lectivo: periodo.ano_lectivo }, { activo: false });
    }

    Object.assign(periodo, dto);
    return this.periodoRepo.save(periodo);
  }

  async cerrarPeriodo(id: string): Promise<Periodo> {
    const periodo = await this.findOnePeriodo(id);
    periodo.cerrado = true;
    periodo.activo = false;
    
    await this.calificacionRepo.update({ periodo: { id } }, { es_nota_final: true });

    return this.periodoRepo.save(periodo);
  }

  // --- CALIFICACIONES ---
  async registrarNota(docenteId: string, dto: RegistrarNotaDto): Promise<CalificacionPeriodo> {
    const { estudiante_id, asignatura_id, periodo_id, nota_original } = dto;

    const periodo = await this.findOnePeriodo(periodo_id);
    if (periodo.cerrado) {
      throw new BadRequestException('El periodo académico está cerrado. No se pueden registrar o modificar notas.');
    }
    if (!periodo.activo) {
      throw new BadRequestException('El periodo académico no está activo actualmente.');
    }

    const matricula = await this.academicService.findMatriculaEstudiante(estudiante_id, periodo.ano_lectivo);
    const grado = matricula.grado;

    const asignatura = await this.academicService.findOneAsignatura(asignatura_id);

    const planes = await this.academicService.findPlanesEstudioByGrado(grado.id);
    const planEstudio = planes.find(p => p.asignatura.id === asignatura_id);
    if (!planEstudio) {
      throw new BadRequestException(`La asignatura '${asignatura.nombre}' no forma parte del plan de estudios del grado '${grado.nombre}'.`);
    }

    const asignacion = await this.academicService.findDocenteAsignacionParaClase(docenteId, planEstudio.id);
    if (!asignacion) {
      throw new BadRequestException(`No tienes permisos para registrar notas en esta materia para el grado '${grado.nombre}'.`);
    }

    let calificacion = await this.calificacionRepo.findOne({
      where: {
        estudiante: { id: estudiante_id },
        asignatura: { id: asignatura_id },
        periodo: { id: periodo_id },
      },
    });

    if (calificacion) {
      if (nota_original >= 3.0) {
        calificacion.nota_nivelacion = null;
      }
      calificacion.nota_original = nota_original;
    } else {
      const estudiante = await this.usersService.findOne(estudiante_id);
      calificacion = this.calificacionRepo.create({
        estudiante,
        asignatura,
        periodo,
        nota_original,
        es_nota_final: false,
      });
    }

    return this.calificacionRepo.save(calificacion);
  }

  async registrarNivelacion(docenteId: string, calificacionId: string, dto: RegistrarNivelacionDto): Promise<CalificacionPeriodo> {
    const { nota_nivelacion } = dto;

    const calificacion = await this.calificacionRepo.findOne({
      where: { id: calificacionId },
      relations: { periodo: true, estudiante: true, asignatura: true },
    });

    if (!calificacion) {
      throw new NotFoundException(`Registro de calificación con ID '${calificacionId}' no encontrado.`);
    }

    const periodo = calificacion.periodo;
    if (periodo.cerrado) {
      throw new BadRequestException('El periodo académico está cerrado. No se pueden modificar notas.');
    }
    if (!periodo.activo) {
      throw new BadRequestException('El periodo académico no está activo actualmente.');
    }

    if (calificacion.nota_original >= 3.0) {
      throw new BadRequestException('El estudiante ya aprobó la asignatura originalmente. No requiere nivelación.');
    }

    const matricula = await this.academicService.findMatriculaEstudiante(calificacion.estudiante.id, periodo.ano_lectivo);
    const planes = await this.academicService.findPlanesEstudioByGrado(matricula.grado.id);
    const planEstudio = planes.find(p => p.asignatura.id === calificacion.asignatura.id);
    if (!planEstudio) {
      throw new BadRequestException('Materia no vinculada al grado.');
    }

    const asignacion = await this.academicService.findDocenteAsignacionParaClase(docenteId, planEstudio.id);
    if (!asignacion) {
      throw new BadRequestException('No tienes permisos de docente para esta clase.');
    }

    calificacion.nota_nivelacion = nota_nivelacion;
    return this.calificacionRepo.save(calificacion);
  }

  async findNotasEstudiante(estudianteId: string, anoLectivo: number): Promise<any[]> {
    const matricula = await this.academicService.findMatriculaEstudiante(estudianteId, anoLectivo);
    const planes = await this.academicService.findPlanesEstudioByGrado(matricula.grado.id);
    
    const calificaciones = await this.calificacionRepo.find({
      where: {
        estudiante: { id: estudianteId },
        periodo: { ano_lectivo: anoLectivo },
      },
      relations: { asignatura: true, periodo: true },
    });

    const boletin = planes.map(plan => {
      const asignatura = plan.asignatura;
      const notasMateria = calificaciones.filter(c => c.asignatura.id === asignatura.id);

      const periodosNotas = notasMateria.map(n => {
        const notaDefinitiva = n.nota_nivelacion !== null ? n.nota_nivelacion : n.nota_original;
        return {
          periodo_id: n.periodo.id,
          periodo_numero: n.periodo.numero,
          periodo_nombre: n.periodo.nombre,
          nota_original: n.nota_original,
          nota_nivelacion: n.nota_nivelacion,
          nota_definitiva: notaDefinitiva,
          aprobado: notaDefinitiva >= 3.0,
          es_final: n.es_nota_final,
        };
      });

      let promedioDefinitiva = 0;
      if (periodosNotas.length > 0) {
        const suma = periodosNotas.reduce((acc, curr) => acc + curr.nota_definitiva, 0);
        promedioDefinitiva = Math.round((suma / periodosNotas.length) * 100) / 100;
      }

      return {
        asignatura_id: asignatura.id,
        asignatura_nombre: asignatura.nombre,
        notas_periodo: periodosNotas,
        promedio_definitivo: promedioDefinitiva,
        estado_actual: promedioDefinitiva >= 3.0 ? 'APROBADO' : 'REPROBADO',
      };
    });

    return boletin;
  }

  async findPlanillaDocente(docenteId: string, planEstudioId: string): Promise<any> {
    const asignaciones = await this.academicService.findAllAsignaciones();
    const asigDoc = asignaciones.find(a => a.docente.id === docenteId && a.planEstudio.id === planEstudioId);
    if (!asigDoc) {
      throw new BadRequestException('No estás asignado a este plan de estudio.');
    }

    const { grado, asignatura } = asigDoc.planEstudio;

    const periodos = await this.periodoRepo.find({ where: { activo: true } });
    if (periodos.length === 0) {
      throw new BadRequestException('No hay ningún periodo académico activo en este momento.');
    }
    const periodoActivo = periodos[0];

    const matriculas = await this.academicService.findEstudiantesMatriculadosEnGrado(grado.id, periodoActivo.ano_lectivo);
    const estudiantes = matriculas.map(m => m.estudiante);

    const calificaciones = await this.calificacionRepo.find({
      where: {
        asignatura: { id: asignatura.id },
        periodo: { id: periodoActivo.id },
      },
      relations: { estudiante: true },
    });

    const planillaEstudiantes = estudiantes.map(estudiante => {
      const nota = calificaciones.find(c => c.estudiante.id === estudiante.id);
      return {
        estudiante_id: estudiante.id,
        estudiante_nombre: `${estudiante.apellidos}, ${estudiante.nombre}`,
        documento_identidad: estudiante.documento_identidad,
        calificacion_id: nota ? nota.id : null,
        nota_original: nota ? nota.nota_original : null,
        nota_nivelacion: nota ? nota.nota_nivelacion : null,
        nota_definitiva: nota ? (nota.nota_nivelacion !== null ? nota.nota_nivelacion : nota.nota_original) : null,
        requiere_nivelacion: nota ? nota.nota_original <= 2.9 : false,
      };
    });

    return {
      plan_estudio_id: planEstudioId,
      grado: grado.nombre,
      asignatura: asignatura.nombre,
      asignatura_id: asignatura.id,
      periodo_activo: {
        id: periodoActivo.id,
        nombre: periodoActivo.nombre,
        numero: periodoActivo.numero,
        ano_lectivo: periodoActivo.ano_lectivo,
      },
      alumnos: planillaEstudiantes,
    };
  }
}
