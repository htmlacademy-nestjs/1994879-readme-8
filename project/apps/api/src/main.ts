/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from '@project/helpers';
import { APP_PREFIX } from '@project/core';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = APP_PREFIX;
  app.setGlobalPrefix(globalPrefix);

  setupSwagger(app, process.env.SWAGGER_TITLE);
  const port = process.env.PORT;
  const host = process.env.HOST;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`
  );
}

bootstrap();
