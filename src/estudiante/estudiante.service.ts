import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
  ) {}

  findAll(): Promise<Estudiante[]> {
    return this.estudianteRepo.find();
  }

  findOne(id: number): Promise<Estudiante | null> {
    return this.estudianteRepo.findOneBy({ id });
  }

  create(data: Partial<Estudiante>) {
    const nuevo = this.estudianteRepo.create(data);
    return this.estudianteRepo.save(nuevo);
  }

  update(id: number, data: Partial<Estudiante>) {
    return this.estudianteRepo.update(id, data);
  }

  delete(id: number) {
    return this.estudianteRepo.delete(id);
  }
}
