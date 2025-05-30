import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesor } from './profesor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,
  ) {}

  findAll(): Promise<Profesor[]> {
    return this.profesorRepo.find();
  }

  findOne(id: number): Promise<Profesor | null> {
    return this.profesorRepo.findOneBy({ id });
  }

  create(data: Partial<Profesor>) {
    const nuevo = this.profesorRepo.create(data);
    return this.profesorRepo.save(nuevo);
  }

  update(id: number, data: Partial<Profesor>) {
    return this.profesorRepo.update(id, data);
  }

  delete(id: number) {
    return this.profesorRepo.delete(id);
  }
}
