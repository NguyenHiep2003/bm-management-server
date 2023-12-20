import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT;
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, transform: true }),
  );
  await app.listen(port);
  Logger.log(`Server is running on port ${port}`);
}
bootstrap();
