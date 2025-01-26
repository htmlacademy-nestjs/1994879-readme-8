import { GatewayConfiguration } from './gateway-configuration';
import { registerAs } from '@nestjs/config';
import { ConfigSpace, validateConfig } from '@project/app-config';

async function getConfig(): Promise<GatewayConfiguration> {
  const config = {
    account: process.env.ACCOUNT_URL,
    blog: process.env.BLOG_URL,
    file: process.env.FILE_URL,
    notify: process.env.NOTIFY_URL,
  };
  return validateConfig(config, GatewayConfiguration);
}

export const gatewayConfig = registerAs(ConfigSpace.Gateway, getConfig);
