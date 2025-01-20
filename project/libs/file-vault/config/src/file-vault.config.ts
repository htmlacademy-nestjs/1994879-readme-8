import { registerAs } from '@nestjs/config';
import { IsString, IsNotEmpty } from 'class-validator';
import { validateConfig } from '@project/app-config';

export class FileVaultConfiguration {
  @IsString()
  @IsNotEmpty()
  uploadDirectory: string;
}

async function getConfig(): Promise<FileVaultConfiguration> {
  const config = {
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
  };

  return validateConfig(config, FileVaultConfiguration);
}

export default registerAs('fileVault', getConfig);
