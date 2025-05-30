import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { Asignatura } from './asignatura.entity';

@Controller('asignatura')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Get()
  findAll() {
    return this.asignaturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.asignaturaService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Asignatura>) {
    return this.asignaturaService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Asignatura>) {
    return this.asignaturaService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.asignaturaService.delete(id);
  }
}
