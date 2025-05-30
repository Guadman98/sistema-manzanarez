import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PagoService } from './pago.service';
import { Pago } from './pago.entity';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Get()
  findAll(): Promise<Pago[]> {
    return this.pagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Pago | null> {
    return this.pagoService.findOne(id);
  }

  @Post()
  create(@Param('id') id: number): Promise<Pago> {
    return this.pagoService.create({ id });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Pago>) {
    return this.pagoService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pagoService.delete(id);
  }
}
