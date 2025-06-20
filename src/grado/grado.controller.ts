import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GradoService } from './grado.service';
import { Grado } from './grado.entity';

@Controller('grado')
export class GradoController {
  constructor(private readonly gradoService: GradoService) {}

  @Get()
  findAll(): Promise<Grado[]> {
    return this.gradoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Grado | null> {
    return this.gradoService.findOne(id);
  }

  @Get(':id/estudiantes')
  async getEstudiantes(@Param('id') id: number) {
    return this.gradoService.obtenerEstudiantesPorGrado(id);
  }

  @Post()
  create(@Body() body: Partial<Grado>) {
    return this.gradoService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Grado>) {
    return this.gradoService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.gradoService.delete(id);
  }
}
