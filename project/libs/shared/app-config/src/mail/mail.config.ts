import { registerAs } from '@nestjs/config';
import { ConfigSpace, validateConfig } from '@project/app-config';
import { MailConfiguration } from './mail-configuration';
import { DEFAULT_SMTP_PORT } from './const';

async function getConfig(): Promise<MailConfiguration> {
  const mail = {
    host: process.env.MAIL_SMTP_HOST,
    port: parseInt(process.env.MAIL_SMTP_PORT ?? DEFAULT_SMTP_PORT.toString(), 10),
    user: process.env.MAIL_USER_NAME,
    password: process.env.MAIL_USER_PASSWORD,
    from: process.env.MAIL_FROM,
  };

  return validateConfig(mail, MailConfiguration);
}

export const mailConfig = registerAs(ConfigSpace.Mail, getConfig);
