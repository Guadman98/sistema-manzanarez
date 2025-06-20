import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from './profesor.entity';
import { ProfesorController } from './profesor.controller';
import { ProfesorService } from './profesor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profesor])],
  controllers: [ProfesorController],
  providers: [ProfesorService],
})
export class ProfesorModule {}
