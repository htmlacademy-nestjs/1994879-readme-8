import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { default as jwtConfig } from './configurations/jwt.config';
import { mongoDbConfig, rabbitMQConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mongoDbConfig, jwtConfig, rabbitMQConfig],
    }),
  ],
})
export class AccountConfigModule {}
