import { registerAs } from '@nestjs/config';
import { ConfigSpace, validateConfig } from '@project/app-config';
import { RabbitConfiguration } from './rabbit-configuration';

async function getConfig(): Promise<RabbitConfiguration> {
  const config = {
    host: process.env.RABBIT_HOST,
    password: process.env.RABBIT_PASSWORD,
    port: parseInt(process.env.RABBIT_PORT, 10),
    user: process.env.RABBIT_USER,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  };

  return validateConfig(config, RabbitConfiguration);
}

export default registerAs(ConfigSpace.Rabbit, getConfig);
