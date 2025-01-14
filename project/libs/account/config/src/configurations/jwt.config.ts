import { registerAs } from '@nestjs/config';
import { IsString, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

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

async function validateConfig(config: JWTConfig): Promise<void> {
  const errors = await validate(config);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints).join(', '))
      .join('\n');
    throw new Error(`Account JWTConfig Validation Error!\n${errorMessages}`);
  }
}

async function getConfig(): Promise<JWTConfig> {
  const config = plainToClass(JWTConfig, {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  });

  await validateConfig(config);
  return config;
}

export default registerAs('jwt', getConfig);
