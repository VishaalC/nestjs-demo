import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormatInterceptor } from './response-format/response-format.interceptor';
import { WinstonModule } from 'nest-winston';
import { loggerInstance } from 'logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // app.useGlobalInterceptors(new ResponseFormatInterceptor());
  const server = await app.listen(3000);
  server.setTimeout(2147483647);
}
bootstrap();
