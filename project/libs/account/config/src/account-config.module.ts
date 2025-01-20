import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { default as JWTConfig } from './configurations/jwt.config';
import { MongoDbConfig, RabbitMQConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [MongoDbConfig, JWTConfig, RabbitMQConfig],
    }),
  ],
})
export class AccountConfigModule {}
