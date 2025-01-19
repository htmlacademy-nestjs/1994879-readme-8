import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '@project/app-config';

export class JWTConfig {
  @IsString()
  accessTokenSecret: string;

  @IsString()
  accessTokenExpiresIn: string;

  @IsString()
  refreshTokenSecret: string;

  @IsString()
  refreshTokenExpiresIn: string;
}

async function getConfig(): Promise<JWTConfig> {
  const config = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  };

  return validateConfig(config, JWTConfig);
}

export default registerAs('jwt', getConfig);
