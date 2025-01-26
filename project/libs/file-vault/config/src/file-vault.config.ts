import { registerAs } from '@nestjs/config';
import { IsString, IsNotEmpty } from 'class-validator';
import { validateConfig } from '@project/app-config';
import { FILE_VAULT_CONFIG_KEY } from './const';

export class FileVaultConfiguration {
  @IsString()
  @IsNotEmpty()
  uploadDirectory: string;

  @IsString()
  @IsNotEmpty()
  serveDirectory: string;
}

async function getConfig(): Promise<FileVaultConfiguration> {
  const config = {
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
    serveDirectory: process.env.SERVE_ROOT,
  };

  return validateConfig(config, FileVaultConfiguration);
}

export const fileVaultConfig = registerAs(FILE_VAULT_CONFIG_KEY, getConfig);
