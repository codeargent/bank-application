import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

void bootstrap();
