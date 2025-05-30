import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './calificacion.entity';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacion])],
  controllers: [CalificacionController],
  providers: [CalificacionService],
})
export class CalificacionModule {}
