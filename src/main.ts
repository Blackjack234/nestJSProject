import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `server is running on ${process.env.PORT ?? 3000}\n http://localhost:${process.env.PORT ?? 3000}/`,
  );
}
bootstrap();
