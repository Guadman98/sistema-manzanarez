import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatriculaController } from './matricula.controller';
import { MatriculaService } from './matricula.service';
import { Matricula } from './matricula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Matricula])],
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule {}
