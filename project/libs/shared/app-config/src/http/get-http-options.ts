import { HttpModuleAsyncOptions } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import httpConfig from './http.config';

export function getHttpAsyncOptions(): HttpModuleAsyncOptions {
  return {
    useFactory: async (options: ConfigType<typeof httpConfig>) => {
      return {
        maxRedirects: options.maxRedirects,
        timeout: options.timeout,
      };
    },
    inject: [httpConfig.KEY],
  };
}
