import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { Profesor } from './profesor.entity';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Get()
  findAll() {
    return this.profesorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.profesorService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Profesor>) {
    return this.profesorService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Profesor>) {
    return this.profesorService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.profesorService.delete(id);
  }
}
