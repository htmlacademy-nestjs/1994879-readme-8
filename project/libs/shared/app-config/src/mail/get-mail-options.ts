import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { ConfigKey } from '../app-config.constant';

export function getMailerAsyncOptions(optionSpace: string): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        transport: {
          host: configService.get<string>(`${optionSpace}.${ConfigKey.Host}`),
          port: configService.get<number>(`${optionSpace}.${ConfigKey.Port}`),
          secure: false,
          auth: {
            user: configService.get<string>(`${optionSpace}.${ConfigKey.User}`),
            pass: configService.get<string>(`${optionSpace}.${ConfigKey.Password}`),
          },
        },
        defaults: {
          from: configService.get<string>(`${optionSpace}.${ConfigKey.From}`),
        },
        template: {
          dir: resolve(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
    },
    inject: [ConfigService],
  };
}
