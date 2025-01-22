import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APP_PREFIX } from '@project/core';

export function setupSwagger(app: INestApplication, title: string) {
  const config = new DocumentBuilder()
    .setTitle(`The «${title}» service`)
    .setDescription(`${title} service API`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(APP_PREFIX, app, document, {
    customSiteTitle: '«Swagger Readme»',
    customfavIcon: 'https://up.htmlacademy.ru/meta/favicon.svg',
  });
}
