import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow React frontend to call this API
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://mo-marketplace-mewan.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  });

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

  // Use PORT from environment or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api`);
}

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server:  http://localhost:3000`);
  console.log(`Swagger: http://localhost:3000/api`);
}
bootstrap();