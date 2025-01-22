import { getMongoConnectionString } from '@project/helpers';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigKey, ConfigSpace } from '../app-config.constant';

export function getMongooseOptions(
  optionSpace: string = ConfigSpace.Mongo
): MongooseModuleAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          username: config.get<string>(`${optionSpace}.${ConfigKey.User}`),
          password: config.get<string>(`${optionSpace}.${ConfigKey.Password}`),
          host: config.get<string>(`${optionSpace}.${ConfigKey.Host}`),
          port: config.get<string>(`${optionSpace}.${ConfigKey.Port}`),
          authDatabase: config.get<string>(`${optionSpace}.${ConfigKey.AuthBase}`),
          databaseName: config.get<string>(`${optionSpace}.${ConfigKey.Name}`),
        }),
      };
    },
  };
}
