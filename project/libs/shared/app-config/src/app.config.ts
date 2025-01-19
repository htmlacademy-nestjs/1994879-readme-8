import { registerAs } from '@nestjs/config';
import { IsString, IsNumber, validate, IsOptional, Max, Min, Length } from 'class-validator';
import { DEFAULT_HOST, PortLimit, TitleLimit } from './const';
import { validateConfig } from './validate-config';

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

async function getConfig(): Promise<AppConfig> {
  const config = {
    host: process.env.HOST || DEFAULT_HOST,
    port: parseInt(process.env.PORT, 10),
    title: process.env.SWAGGER_TITLE,
  };

  return validateConfig(config, AppConfig);
}

export const appConfig = registerAs('application', getConfig);
