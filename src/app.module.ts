import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProfesorModule } from './profesor/profesor.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { GradoModule } from './grado/grado.module';
import { MatriculaModule } from './matricula/matricula.module';
import { CalificacionModule } from './calificacion/calificacion.module';
import { PagoModule } from './pago/pago.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'soporte',
      password: 'soporte',
      database: 'sistema_manzanarez',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ solo en desarrollo
    }),
    EstudianteModule,
    ProfesorModule,
    AsignaturaModule,
    GradoModule,
    MatriculaModule,
    CalificacionModule,
    PagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
