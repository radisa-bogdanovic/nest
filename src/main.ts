import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExeptionFilter } from 'common/filters/global-exeption.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExeptionFilter());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      stopAtFirstError: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Coordinator API')
    .setDescription('Api dokumentacija')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.security = [{ 'access-token': [] }];

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors({
    origin: 'http://localhost:6767',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
