import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './configurations/mongo.config';
import jwtConfig from './configurations/jwt.config';

const ENV_USERS_FILE_PATH = 'apps/account/account.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mongoConfig, jwtConfig],
      envFilePath: ENV_USERS_FILE_PATH,
    }),
  ],
})
export class AccountConfigModule {}
