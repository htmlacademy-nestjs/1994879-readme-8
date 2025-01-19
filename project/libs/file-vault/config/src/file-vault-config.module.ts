import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import fileVaultConfig from './file-vault.config';
import { mongoDbConfig } from '@project/app-config';

const ENV_FILE_PATH = 'apps/file-vault/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [fileVaultConfig, mongoDbConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ],
})
export class FileVaultConfigModule {}
