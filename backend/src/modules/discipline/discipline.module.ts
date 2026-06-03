import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservacionDisciplinaria } from '../../entities/observacion-disciplinaria.entity';
import { UsersModule } from '../users/users.module';
import { DisciplineService } from './discipline.service';
import { DisciplineController } from './discipline.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObservacionDisciplinaria]),
    UsersModule,
  ],
  controllers: [DisciplineController],
  providers: [DisciplineService],
  exports: [DisciplineService],
})
export class DisciplineModule {}
