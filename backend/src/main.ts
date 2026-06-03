import * as crypto from 'crypto';
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: crypto,
    writable: true,
    configurable: true,
  });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir peticiones del frontend
  app.enableCors();

  // Validaciones globales de DTOs con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades sobrantes que no estén en el DTO
      transform: true, // Transforma tipos automáticamente (ej: string a number)
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Liceo Ecológico Manzanarez')
    .setDescription('API de gestión académica y financiera')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor backend ejecutándose en: http://localhost:${port}`);
  console.log(`📖 Documentación Swagger disponible en: http://localhost:${port}/api`);
}
bootstrap();

