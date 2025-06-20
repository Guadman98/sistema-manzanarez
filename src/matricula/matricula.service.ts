import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Matricula } from './matricula.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private matriculaRepo: Repository<Matricula>,
  ) {}

  findAll(): Promise<Matricula[]> {
    return this.matriculaRepo.find();
  }

  findOne(id: number): Promise<Matricula | null> {
    return this.matriculaRepo.findOneBy({ id });
  }

  create(body: Partial<Matricula>) {
    const nuevo = this.matriculaRepo.create(body);
    return this.matriculaRepo.save(nuevo);
  }

  update(id: number, body: Partial<Matricula>) {
    return this.matriculaRepo.update(id, body);
  }

  delete(id: number) {
    return this.matriculaRepo.delete(id);
  }
}
