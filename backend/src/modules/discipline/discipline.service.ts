import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObservacionDisciplinaria, CategoriaDisciplinaria } from '../../entities/observacion-disciplinaria.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../../entities/user.entity';
import { CreateObservacionDto } from './dto/create-observacion.dto';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectRepository(ObservacionDisciplinaria)
    private readonly observacionRepo: Repository<ObservacionDisciplinaria>,
    private readonly usersService: UsersService,
  ) {}

  async create(docenteId: string, dto: CreateObservacionDto): Promise<ObservacionDisciplinaria> {
    const { estudiante_id, fecha_incidente, categoria, descripcion } = dto;

    const docente = await this.usersService.findOne(docenteId);
    if (docente.role !== Role.TEACHER) {
      throw new BadRequestException('El usuario registrador debe tener el rol de TEACHER.');
    }

    const estudiante = await this.usersService.findOne(estudiante_id);
    if (estudiante.role !== Role.STUDENT) {
      throw new BadRequestException('El estudiante a reportar debe tener el rol de STUDENT.');
    }

    const observacion = this.observacionRepo.create({
      estudiante,
      docente,
      fecha_incidente,
      categoria,
      descripcion,
      estado: 'REGISTRADO',
    });

    return this.observacionRepo.save(observacion);
  }

  async findStudentObservaciones(estudianteId: string, categoria?: CategoriaDisciplinaria): Promise<ObservacionDisciplinaria[]> {
    const query: any = { estudiante: { id: estudianteId } };
    if (categoria) {
      query.categoria = categoria;
    }
    return this.observacionRepo.find({
      where: query,
      relations: { docente: true, estudiante: true },
      order: { fecha_incidente: 'DESC' },
    });
  }

  async findAll(categoria?: CategoriaDisciplinaria): Promise<ObservacionDisciplinaria[]> {
    const query: any = {};
    if (categoria) {
      query.categoria = categoria;
    }
    return this.observacionRepo.find({
      where: query,
      relations: { docente: true, estudiante: true },
      order: { fecha_incidente: 'DESC' },
    });
  }
}
