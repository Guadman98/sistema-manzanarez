import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificado, EstadoCertificado, TipoCertificado } from '../../entities/certificado.entity';
import { UsersService } from '../users/users.service';
import { AcademicService } from '../academic/academic.service';
import { Role } from '../../entities/user.entity';
import { SolicitarCertificadoDto } from './dto/solicitar-certificado.dto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificado)
    private readonly certificadoRepo: Repository<Certificado>,
    private readonly usersService: UsersService,
    private readonly academicService: AcademicService,
  ) {}

  async solicitar(estudianteId: string, dto: SolicitarCertificadoDto): Promise<Certificado> {
    const estudiante = await this.usersService.findOne(estudianteId);
    if (estudiante.role !== Role.STUDENT) {
      throw new BadRequestException('Solo los estudiantes pueden solicitar certificados.');
    }

    const certificado = this.certificadoRepo.create({
      estudiante,
      tipo: dto.tipo,
      estado: EstadoCertificado.PENDIENTE,
    });

    return this.certificadoRepo.save(certificado);
  }

  async aprobar(id: string): Promise<Certificado> {
    const certificado = await this.certificadoRepo.findOne({
      where: { id },
      relations: { estudiante: true },
    });

    if (!certificado) {
      throw new NotFoundException(`Certificado con ID '${id}' no encontrado.`);
    }

    if (certificado.estado === EstadoCertificado.APROBADO) {
      throw new BadRequestException('El certificado ya ha sido aprobado.');
    }

    const year = new Date().getFullYear();
    let uniqueCode = '';
    let exists = true;

    while (exists) {
      const randomPart = this.generateRandomString(5);
      uniqueCode = `LEM-${year}-${randomPart}`;
      const codeExists = await this.certificadoRepo.findOne({ where: { codigo_verificacion: uniqueCode } });
      if (!codeExists) {
        exists = false;
      }
    }

    certificado.codigo_verificacion = uniqueCode;
    certificado.estado = EstadoCertificado.APROBADO;
    certificado.fecha_aprobacion = new Date();

    return this.certificadoRepo.save(certificado);
  }

  async verificar(codigo: string): Promise<any> {
    const certificado = await this.certificadoRepo.findOne({
      where: { codigo_verificacion: codigo },
      relations: { estudiante: true },
    });

    if (!certificado) {
      throw new NotFoundException(`El código de certificado '${codigo}' no es válido o no existe.`);
    }

    let gradoNombre = 'No Matriculado';
    try {
      const year = new Date(certificado.fecha_aprobacion ?? new Date()).getFullYear();
      const matricula = await this.academicService.findMatriculaEstudiante(certificado.estudiante.id, year);
      gradoNombre = matricula.grado.nombre;
    } catch (e) {
      try {
        const matricula = await this.academicService.findMatriculaEstudiante(certificado.estudiante.id);
        gradoNombre = `${matricula.grado.nombre} (Año: ${matricula.ano_lectivo})`;
      } catch (err) {
        // Ignorar si no tiene matrícula
      }
    }

    return {
      valido: true,
      mensaje: 'Certificado de autenticidad válido',
      certificado_id: certificado.id,
      tipo: certificado.tipo,
      fecha_aprobacion: certificado.fecha_aprobacion,
      estudiante: {
        nombre_completo: `${certificado.estudiante.apellidos}, ${certificado.estudiante.nombre}`,
        documento_identidad: certificado.estudiante.documento_identidad,
        grado: gradoNombre,
      },
      colegio: 'LICEO ECOLOGICO MANZANAREZ',
    };
  }

  async findStudentCertificados(estudianteId: string): Promise<Certificado[]> {
    return this.certificadoRepo.find({
      where: { estudiante: { id: estudianteId } },
      order: { fecha_solicitud: 'DESC' },
    });
  }

  async findAll(): Promise<Certificado[]> {
    return this.certificadoRepo.find({
      relations: { estudiante: true },
      order: { fecha_solicitud: 'DESC' },
    });
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
