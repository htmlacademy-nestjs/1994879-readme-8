import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { default as FileVaultConfig } from './file-vault.config';
import { MongoDbConfig } from '@project/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [FileVaultConfig, MongoDbConfig],
    }),
  ],
})
export class FileVaultConfigModule {}
