import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grado } from '../../entities/grado.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { PlanEstudio } from '../../entities/plan-estudio.entity';
import { Matricula } from '../../entities/matricula.entity';
import { AsignacionDocente } from '../../entities/asignacion-docente.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../../entities/user.entity';
import { CreateGradoDto } from './dto/create-grado.dto';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { MatricularEstudianteDto } from './dto/matricular-estudiante.dto';
import { VincularMateriaDto } from './dto/vincular-materia.dto';
import { AsignarDocenteDto } from './dto/asignar-docente.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepo: Repository<Grado>,
    @InjectRepository(Asignatura)
    private readonly asignaturaRepo: Repository<Asignatura>,
    @InjectRepository(PlanEstudio)
    private readonly planEstudioRepo: Repository<PlanEstudio>,
    @InjectRepository(Matricula)
    private readonly matriculaRepo: Repository<Matricula>,
    @InjectRepository(AsignacionDocente)
    private readonly asignacionRepo: Repository<AsignacionDocente>,
    private readonly usersService: UsersService,
  ) {}

  // --- GRADOS ---
  async createGrado(createGradoDto: CreateGradoDto): Promise<Grado> {
    const { nombre } = createGradoDto;
    const exists = await this.gradoRepo.findOne({ where: { nombre } });
    if (exists) {
      throw new ConflictException(`El grado '${nombre}' ya existe.`);
    }
    const grado = this.gradoRepo.create({ nombre });
    return this.gradoRepo.save(grado);
  }

  async findAllGrados(): Promise<Grado[]> {
    return this.gradoRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOneGrado(id: string): Promise<Grado> {
    const grado = await this.gradoRepo.findOne({ where: { id } });
    if (!grado) {
      throw new NotFoundException(`Grado con ID '${id}' no encontrado.`);
    }
    return grado;
  }

  // --- ASIGNATURAS ---
  async createAsignatura(createAsignaturaDto: CreateAsignaturaDto): Promise<Asignatura> {
    const { nombre } = createAsignaturaDto;
    const exists = await this.asignaturaRepo.findOne({ where: { nombre } });
    if (exists) {
      throw new ConflictException(`La asignatura '${nombre}' ya existe.`);
    }
    const asignatura = this.asignaturaRepo.create({ nombre });
    return this.asignaturaRepo.save(asignatura);
  }

  async findAllAsignaturas(): Promise<Asignatura[]> {
    return this.asignaturaRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOneAsignatura(id: string): Promise<Asignatura> {
    const asignatura = await this.asignaturaRepo.findOne({ where: { id } });
    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID '${id}' no encontrada.`);
    }
    return asignatura;
  }

  // --- PLAN DE ESTUDIOS (VINCULAR MATERIAS A GRADOS) ---
  async vincularMateria(vincularMateriaDto: VincularMateriaDto): Promise<PlanEstudio> {
    const { grado_id, asignatura_id } = vincularMateriaDto;

    const grado = await this.findOneGrado(grado_id);
    const asignatura = await this.findOneAsignatura(asignatura_id);

    const exists = await this.planEstudioRepo.findOne({
      where: { grado: { id: grado_id }, asignatura: { id: asignatura_id } },
    });
    if (exists) {
      throw new ConflictException(`La asignatura '${asignatura.nombre}' ya está vinculada al grado '${grado.nombre}'.`);
    }

    const plan = this.planEstudioRepo.create({ grado, asignatura });
    return this.planEstudioRepo.save(plan);
  }

  async findAllPlanesEstudio(): Promise<PlanEstudio[]> {
    return this.planEstudioRepo.find({
      relations: { grado: true, asignatura: true },
      order: { grado: { nombre: 'ASC' }, asignatura: { nombre: 'ASC' } },
    });
  }

  async findPlanesEstudioByGrado(gradoId: string): Promise<PlanEstudio[]> {
    return this.planEstudioRepo.find({
      where: { grado: { id: gradoId } },
      relations: { grado: true, asignatura: true },
    });
  }

  // --- MATRÍCULAS ---
  async matricularEstudiante(dto: MatricularEstudianteDto): Promise<Matricula> {
    const { estudiante_id, grado_id, ano_lectivo } = dto;

    const estudiante = await this.usersService.findOne(estudiante_id);
    if (estudiante.role !== Role.STUDENT) {
      throw new BadRequestException('El usuario a matricular debe tener el rol de STUDENT.');
    }

    const grado = await this.findOneGrado(grado_id);

    const exists = await this.matriculaRepo.findOne({
      where: { estudiante: { id: estudiante_id }, ano_lectivo },
    });
    if (exists) {
      throw new ConflictException(`El estudiante ya está matriculado para el año lectivo ${ano_lectivo}.`);
    }

    const matricula = this.matriculaRepo.create({
      estudiante,
      grado,
      ano_lectivo,
    });
    return this.matriculaRepo.save(matricula);
  }

  async findAllMatriculas(): Promise<Matricula[]> {
    return this.matriculaRepo.find({
      relations: { estudiante: true, grado: true },
      order: { ano_lectivo: 'DESC', grado: { nombre: 'ASC' } },
    });
  }

  async findMatriculaEstudiante(estudianteId: string, anoLectivo?: number): Promise<Matricula> {
    const query: any = { estudiante: { id: estudianteId } };
    if (anoLectivo) {
      query.ano_lectivo = anoLectivo;
    }
    const matricula = await this.matriculaRepo.findOne({
      where: query,
      relations: { estudiante: true, grado: true },
      order: { ano_lectivo: 'DESC' },
    });
    if (!matricula) {
      throw new NotFoundException(`Matrícula no encontrada para el estudiante.`);
    }
    return matricula;
  }

  // --- ASIGNACIONES DOCENTES ---
  async asignarDocente(dto: AsignarDocenteDto): Promise<AsignacionDocente> {
    const { docente_id, plan_estudio_id } = dto;

    const docente = await this.usersService.findOne(docente_id);
    if (docente.role !== Role.TEACHER) {
      throw new BadRequestException('El docente asignado debe tener el rol de TEACHER.');
    }

    const planEstudio = await this.planEstudioRepo.findOne({
      where: { id: plan_estudio_id },
      relations: { grado: true, asignatura: true },
    });
    if (!planEstudio) {
      throw new NotFoundException(`Plan de estudio con ID '${plan_estudio_id}' no encontrado.`);
    }

    const exists = await this.asignacionRepo.findOne({
      where: { docente: { id: docente_id }, planEstudio: { id: plan_estudio_id } },
    });
    if (exists) {
      throw new ConflictException('Esta asignación docente ya existe.');
    }

    const asignacion = this.asignacionRepo.create({
      docente,
      planEstudio,
    });
    return this.asignacionRepo.save(asignacion);
  }

  async findAllAsignaciones(): Promise<AsignacionDocente[]> {
    return this.asignacionRepo.find({
      relations: {
        docente: true,
        planEstudio: {
          grado: true,
          asignatura: true,
        },
      },
    });
  }

  async findAsignacionesDocente(docenteId: string): Promise<AsignacionDocente[]> {
    return this.asignacionRepo.find({
      where: { docente: { id: docenteId } },
      relations: {
        docente: true,
        planEstudio: {
          grado: true,
          asignatura: true,
        },
      },
    });
  }

  async findDocenteAsignacionParaClase(docenteId: string, planEstudioId: string): Promise<AsignacionDocente | null> {
    return this.asignacionRepo.findOne({
      where: { docente: { id: docenteId }, planEstudio: { id: planEstudioId } },
      relations: {
        docente: true,
        planEstudio: {
          grado: true,
          asignatura: true,
        },
      },
    });
  }

  async findEstudiantesMatriculadosEnGrado(gradoId: string, anoLectivo: number): Promise<Matricula[]> {
    return this.matriculaRepo.find({
      where: { grado: { id: gradoId }, ano_lectivo: anoLectivo },
      relations: { estudiante: true },
    });
  }
}
