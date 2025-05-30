import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturaController } from './asignatura.controller';
import { AsignaturaService } from './asignatura.service';
import { Asignatura } from './asignatura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asignatura])],
  controllers: [AsignaturaController],
  providers: [AsignaturaService],
})
export class AsignaturaModule {}
