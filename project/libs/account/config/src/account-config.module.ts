import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './configurations/jwt.config';
import { mongoDbConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mongoDbConfig, jwtConfig],
    }),
  ],
})
export class AccountConfigModule {}
