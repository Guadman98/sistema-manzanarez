import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { Matricula } from './matricula.entity';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Get()
  findAll(): Promise<Matricula[]> {
    return this.matriculaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Matricula | null> {
    return this.matriculaService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Matricula>) {
    return this.matriculaService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Matricula>) {
    return this.matriculaService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.matriculaService.delete(id);
  }
}
