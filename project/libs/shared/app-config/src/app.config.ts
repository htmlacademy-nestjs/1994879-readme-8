import { registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsString, IsNumber, validate, IsOptional, Max, Min, Length } from 'class-validator';
import { DEFAULT_HOST, PortLimit, TitleLimit } from './const';

export class AppConfig {
  @IsString()
  @IsOptional()
  host: string;

  @IsNumber()
  @Min(PortLimit.Min)
  @Max(PortLimit.Max)
  port: number;

  @IsString()
  @Length(TitleLimit.Min, TitleLimit.Max)
  title: string;
}

export async function validateConfig(config: AppConfig) {
  const validatedConfig = plainToClass(AppConfig, config);
  const errors = await validate(validatedConfig);

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => Object.values(error.constraints).join(', ')).join('\n');
    throw new Error(`Configuration validation failed!\n${errorMessages}`);
  }
  return validatedConfig;
}

async function getConfig(): Promise<AppConfig> {
  const config = {
    host: process.env.HOST || DEFAULT_HOST,
    port: parseInt(process.env.PORT, 10),
    title: process.env.SWAGGER_TITLE,
  };

  return validateConfig(config);
}

export const appConfig = registerAs('application', getConfig);
