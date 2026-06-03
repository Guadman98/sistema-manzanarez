import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './entities/user.entity';
import { Periodo } from './entities/periodo.entity';
import { Grado } from './entities/grado.entity';
import { Asignatura } from './entities/asignatura.entity';
import { PlanEstudio } from './entities/plan-estudio.entity';
import { Matricula } from './entities/matricula.entity';
import { AsignacionDocente } from './entities/asignacion-docente.entity';
import { CalificacionPeriodo } from './entities/calificacion-periodo.entity';
import { ObservacionDisciplinaria } from './entities/observacion-disciplinaria.entity';
import { Certificado } from './entities/certificado.entity';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AcademicModule } from './modules/academic/academic.module';
import { GradesModule } from './modules/grades/grades.module';
import { DisciplineModule } from './modules/discipline/discipline.module';
import { CertificatesModule } from './modules/certificates/certificates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'lem_user'),
        password: configService.get<string>('DB_PASSWORD', 'lem_password'),
        database: configService.get<string>('DB_DATABASE', 'lem_db'),
        entities: [
          User,
          Periodo,
          Grado,
          Asignatura,
          PlanEstudio,
          Matricula,
          AsignacionDocente,
          CalificacionPeriodo,
          ObservacionDisciplinaria,
          Certificado,
        ],
        synchronize: true, // Para desarrollo, sincroniza entidades con la BD automáticamente
      }),
    }),
    UsersModule,
    AuthModule,
    AcademicModule,
    GradesModule,
    DisciplineModule,
    CertificatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}






