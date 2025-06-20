import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradoController } from './grado.controller';
import { GradoService } from './grado.service';
import { Grado } from './grado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grado])],
  controllers: [GradoController],
  providers: [GradoService],
})
export class GradoModule {}
