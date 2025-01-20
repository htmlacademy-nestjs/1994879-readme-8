import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailConfig, MongoDbConfig, RabbitMQConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [MongoDbConfig, RabbitMQConfig, MailConfig],
    }),
  ],
})
export class NotifyConfigModule {}
