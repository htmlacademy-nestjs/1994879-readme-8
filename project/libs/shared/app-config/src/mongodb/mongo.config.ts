import { ConfigType, registerAs } from '@nestjs/config';
import { validateConfig } from '../application/validate-config';
import { MongoConfiguration } from './mongo-configuration';
import { ConfigSpace } from '../app-config.constant';

async function getDbConfig(): Promise<MongoConfiguration> {
  const config = {
    host: process.env.MONGO_HOST,
    name: process.env.MONGO_DB,
    port: parseInt(process.env.MONGO_PORT, 10),
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    authBase: process.env.MONGO_AUTH_BASE,
  };

  return validateConfig(config, MongoConfiguration);
}

export default registerAs(
  ConfigSpace.Mongo,
  async (): Promise<ConfigType<typeof getDbConfig>> => getDbConfig()
);
