import { registerAs } from '@nestjs/config';
import { IsNumber, IsOptional } from 'class-validator';
import { HttpClientDefault } from './const';
import { validateConfig } from '../application/validate-config';
import { ConfigSpace } from '../app-config.constant';

export class HttpConfig {
  @IsNumber()
  @IsOptional()
  timeout: number;

  @IsNumber()
  @IsOptional()
  maxRedirects: number;
}

async function getConfig(): Promise<HttpConfig> {
  const config = {
    timeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT, 10) || HttpClientDefault.Timeout,
    maxRedirects:
      parseInt(process.env.HTTP_CLIENT_MAX_REDIRECTS, 10) || HttpClientDefault.MaxRedirects,
  };

  return validateConfig(config, HttpConfig);
}

export default registerAs(ConfigSpace.Http, getConfig);
