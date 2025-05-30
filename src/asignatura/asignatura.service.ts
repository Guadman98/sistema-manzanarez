import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignatura } from './asignatura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsignaturaService {
  constructor(
    @InjectRepository(Asignatura)
    private asignaturaRepo: Repository<Asignatura>,
  ) {}

  findAll() {
    return this.asignaturaRepo.find();
  }

  findOne(id: number) {
    return this.asignaturaRepo.findOneBy({ id });
  }

  create(body: Partial<Asignatura>) {
    const nuevo = this.asignaturaRepo.create(body);
    return this.asignaturaRepo.save(nuevo);
  }

  update(id: number, body: Partial<Asignatura>) {
    return this.asignaturaRepo.update(id, body);
  }

  delete(id: number) {
    return this.asignaturaRepo.delete(id);
  }
}
