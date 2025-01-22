import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';
import { RabbitRouting } from '@project/core';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { rabbitMQConfig } from '@project/app-config';

@Injectable()
export class NotifyService {
  constructor(
    @Inject(AmqpConnection) private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitMQConfig.KEY) private readonly rabbitOptions: ConfigType<typeof rabbitMQConfig>
  ) {}

  public async registerSubscriber(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish(this.rabbitOptions.exchange, RabbitRouting.AddSubscriber, dto);
  }
}
