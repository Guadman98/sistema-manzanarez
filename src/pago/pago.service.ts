import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pago.entity';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private pagoRepo: Repository<Pago>,
  ) {}

  findAll(): Promise<Pago[]> {
    return this.pagoRepo.find();
  }

  findOne(id: number): Promise<Pago | null> {
    return this.pagoRepo.findOneBy({ id });
  }

  create(data: Partial<Pago>) {
    const nuevo = this.pagoRepo.create(data);
    return this.pagoRepo.save(nuevo);
  }

  update(id: number, data: Partial<Pago>) {
    return this.pagoRepo.update(id, data);
  }

  delete(id: number) {
    return this.pagoRepo.delete(id);
  }
}
