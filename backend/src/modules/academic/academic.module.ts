import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from '../../entities/grado.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { PlanEstudio } from '../../entities/plan-estudio.entity';
import { Matricula } from '../../entities/matricula.entity';
import { AsignacionDocente } from '../../entities/asignacion-docente.entity';
import { UsersModule } from '../users/users.module';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grado, Asignatura, PlanEstudio, Matricula, AsignacionDocente]),
    UsersModule,
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
