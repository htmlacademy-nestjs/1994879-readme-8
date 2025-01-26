import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { fileVaultConfig } from './file-vault.config';
import { mongoDbConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [fileVaultConfig, mongoDbConfig],
    }),
  ],
})
export class FileVaultConfigModule {}
