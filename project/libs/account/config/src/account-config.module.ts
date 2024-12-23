import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './configurations/mongo.config';

const ENV_USERS_FILE_PATH = 'apps/account/account.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mongoConfig],
      envFilePath: ENV_USERS_FILE_PATH,
    }),
  ],
})
export class AccountConfigModule {}