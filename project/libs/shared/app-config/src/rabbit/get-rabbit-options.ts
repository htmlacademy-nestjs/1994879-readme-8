import { ConfigService } from '@nestjs/config';
import { getRabbitMQConnectionString } from '@project/helpers';

export function getRabbitMQOptions(optionSpace) {
  return {
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get<string>(`${optionSpace}.queue`),
          type: 'direct',
        },
      ],
      uri: getRabbitMQConnectionString({
        host: config.get<string>(`${optionSpace}.host`),
        password: config.get<string>(`${optionSpace}.password`),
        user: config.get<string>(`${optionSpace}.user`),
        port: config.get<string>(`${optionSpace}.port`),
      }),
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
    }),
  };
}
