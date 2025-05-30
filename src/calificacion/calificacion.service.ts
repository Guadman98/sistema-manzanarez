import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private calificacionRepo: Repository<Calificacion>,
  ) {}

  findAll(): Promise<Calificacion[]> {
    return this.calificacionRepo.find();
  }

  findOne(id: number): Promise<Calificacion | null> {
    return this.calificacionRepo.findOneBy({ id });
  }

  create(data: Partial<Calificacion>) {
    const nueva = this.calificacionRepo.create(data);
    return this.calificacionRepo.save(nueva);
  }

  update(id: number, data: Partial<Calificacion>) {
    return this.calificacionRepo.update(id, data);
  }

  delete(id: number) {
    return this.calificacionRepo.delete(id);
  }
}
