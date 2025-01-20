import { registerAs } from '@nestjs/config';
import { IsString, IsNotEmpty } from 'class-validator';
import { validateConfig } from '@project/app-config';

export class FileVaultConfig {
  @IsString()
  @IsNotEmpty()
  uploadDirectory: string;
}

async function getConfig(): Promise<FileVaultConfig> {
  const config = {
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
  };

  return validateConfig(config, FileVaultConfig);
}

export default registerAs('fileVault', getConfig);
