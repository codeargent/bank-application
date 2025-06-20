import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error if unknown properties are sent
      transform: true, // transforms payloads to DTO instances
    }),
  );

  await app.listen(process.env.APP_PORT ?? 3001);
}

void bootstrap();
