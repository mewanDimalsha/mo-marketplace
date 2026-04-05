import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow React frontend to call this API
  app.enableCors();

  // Automatically validate all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,    // strip unknown fields
      transform: true,    // convert types automatically
    }),
  );

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('MO Marketplace API')
    .setDescription('Product & Variant management with JWT auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server:  http://localhost:3000`);
  console.log(`Swagger: http://localhost:3000/api`);
}
bootstrap();