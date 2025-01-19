import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { getApplicationUrl, setupSwagger } from '@project/helpers';
import { APP_PREFIX } from '@project/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = APP_PREFIX;
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const appConfig = app.get(ConfigService);
  const host = appConfig.get<string>('application.host');
  const port = appConfig.get<number>('application.port');
  const title = appConfig.get<string>('application.title');

  setupSwagger(app, title);

  await app.listen(port, host);

  const applicationUrl = getApplicationUrl(host, port, globalPrefix);
  Logger.log(`🚀 Application is running on: ${applicationUrl}`);
}

bootstrap();
