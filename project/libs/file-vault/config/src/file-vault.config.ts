import { registerAs } from '@nestjs/config';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { validateConfig } from '@project/app-config';
import { Environment } from '@project/core';
import { AppConfig } from 'libs/shared/app-config/src/app.config';

export class FileVaultConfig {
  @IsEnum(Environment)
  environment: Environment;

  @IsString()
  @IsNotEmpty()
  uploadDirectory: string;
}

async function getConfig(): Promise<FileVaultConfig> {
  const config = {
    environment: process.env.NODE_ENV,
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
  };

  return validateConfig(config, FileVaultConfig);
}

export default registerAs('fileVault', getConfig);
