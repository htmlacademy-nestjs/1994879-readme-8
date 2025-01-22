import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailConfig, mongoDbConfig, rabbitMQConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mongoDbConfig, rabbitMQConfig, mailConfig],
    }),
  ],
})
export class NotifyConfigModule {}
