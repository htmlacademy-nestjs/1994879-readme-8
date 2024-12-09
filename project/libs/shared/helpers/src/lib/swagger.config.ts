import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APP_PREFIX } from '@project/core';

export function setupSwagger(app: INestApplication, title: string) {
  const config = new DocumentBuilder()
    .setTitle(`The «${title}» service`)
    .setDescription(`${title} service API`)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(APP_PREFIX, app, document);
}
