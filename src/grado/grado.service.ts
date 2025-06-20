import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grado } from './grado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradoService {
  constructor(
    @InjectRepository(Grado)
    private gradoRepo: Repository<Grado>,
  ) {}

  async obtenerEstudiantesPorGrado(gradoId: number) {
    const grado = await this.gradoRepo.findOne({
      where: { id: gradoId },
      relations: ['estudiantes'],
    });

    if (!grado) {
      throw new Error('Grado no encontrado');
    }

    return grado.estudiantes;
  }

  findAll(): Promise<Grado[]> {
    return this.gradoRepo.find();
  }

  findOne(id: number): Promise<Grado | null> {
    return this.gradoRepo.findOneBy({ id });
  }

  create(body: Partial<Grado>) {
    const nuevo = this.gradoRepo.create(body);
    return this.gradoRepo.save(nuevo);
  }

  update(id: number, body: Partial<Grado>) {
    return this.gradoRepo.update(id, body);
  }

  delete(id: number) {
    return this.gradoRepo.delete(id);
  }
}
