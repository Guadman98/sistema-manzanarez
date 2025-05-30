import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { Calificacion } from './calificacion.entity';

@Controller('calificacion')
export class CalificacionController {
  constructor(private readonly calificacionService: CalificacionService) {}

  @Get()
  findAll(): Promise<Calificacion[]> {
    return this.calificacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Calificacion | null> {
    return this.calificacionService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Calificacion>): Promise<Calificacion> {
    return this.calificacionService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Calificacion>) {
    return this.calificacionService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.calificacionService.delete(id);
  }
}
