import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const requiredEnvVars = ['ENV', 'PORT', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.ENV !== 'prod') {
    SwaggerModule.setup(
      'docs',
      app,
      SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Todo List API').addBearerAuth().build()),
      {
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          tagsSorter: 'alpha',
          apisSorter: 'alpha',
        },
      },
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
