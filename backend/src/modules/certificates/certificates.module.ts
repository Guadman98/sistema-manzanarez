import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificado } from '../../entities/certificado.entity';
import { UsersModule } from '../users/users.module';
import { AcademicModule } from '../academic/academic.module';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificado]),
    UsersModule,
    AcademicModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
