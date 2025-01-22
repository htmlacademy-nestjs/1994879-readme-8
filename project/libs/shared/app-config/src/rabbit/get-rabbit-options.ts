import { ConfigService } from '@nestjs/config';
import { getRabbitMQConnectionString } from '@project/helpers';
import { ConfigKey } from '../app-config.constant';

export function getRabbitMQOptions(optionSpace) {
  return {
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get<string>(`${optionSpace}.${ConfigKey.Exchange}`),
          type: 'direct',
        },
      ],
      uri: getRabbitMQConnectionString({
        host: config.get<string>(`${optionSpace}.${ConfigKey.Host}`),
        password: config.get<string>(`${optionSpace}.${ConfigKey.Password}`),
        user: config.get<string>(`${optionSpace}.${ConfigKey.User}`),
        port: config.get<string>(`${optionSpace}.${ConfigKey.Port}`),
      }),
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
    }),
  };
}
