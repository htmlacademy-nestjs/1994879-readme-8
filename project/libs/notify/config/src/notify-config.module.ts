import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mongoDbConfig, rabbitMQConfig } from '@project/app-config';

const ENV_FILE_PATH = 'apps/notify/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [rabbitMQConfig, mongoDbConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ],
})
export class NotifyConfigModule {}
