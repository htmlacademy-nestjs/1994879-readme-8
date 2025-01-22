import { registerAs } from '@nestjs/config';
import { IsString, IsNumber, IsOptional, Max, Min, Length, IsEnum } from 'class-validator';
import { DEFAULT_HOST, TitleLimit } from './const';
import { PortLimit } from '@project/helpers';
import { validateConfig } from './validate-config';
import { Environment } from '@project/core';
import { ConfigSpace } from '../app-config.constant';

export class AppConfig {
  @IsEnum(Environment)
  @IsOptional()
  environment: Environment;

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
    environment: process.env.NODE_ENV,
    host: process.env.HOST || DEFAULT_HOST,
    port: parseInt(process.env.PORT, 10),
    title: process.env.SWAGGER_TITLE,
  };

  return validateConfig(config, AppConfig);
}

export const appConfig = registerAs(ConfigSpace.App, getConfig);
