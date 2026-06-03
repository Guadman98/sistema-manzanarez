import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Periodo } from '../../entities/periodo.entity';
import { CalificacionPeriodo } from '../../entities/calificacion-periodo.entity';
import { AcademicModule } from '../academic/academic.module';
import { UsersModule } from '../users/users.module';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Periodo, CalificacionPeriodo]),
    AcademicModule,
    UsersModule,
  ],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}
