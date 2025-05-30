import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get()
  findAll(): Promise<Estudiante[]> {
    return this.estudianteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Estudiante | null> {
    return this.estudianteService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Estudiante>) {
    return this.estudianteService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Estudiante>) {
    return this.estudianteService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.estudianteService.delete(id);
  }
}
