import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './configurations/jwt.config';
import { MongoDbConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [MongoDbConfig, jwtConfig],
    }),
  ],
})
export class AccountConfigModule {}
