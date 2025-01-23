import { Inject, Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';
import { RabbitRouting } from '@project/core';
import { rabbitMQConfig } from '@project/app-config';
import { CreateSubscriberDto, NotifyNewPostDto } from '@project/email-subscriber';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);
  constructor(
    @Inject(AmqpConnection) private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitMQConfig.KEY) private readonly rabbitOptions: ConfigType<typeof rabbitMQConfig>
  ) {}

  public async registerSubscriber(dto: CreateSubscriberDto) {
    this.logger.debug(RabbitRouting.AddSubscriber, dto);
    return this.rabbitClient.publish(this.rabbitOptions.exchange, RabbitRouting.AddSubscriber, dto);
  }

  public async notifyNewPost(dto: NotifyNewPostDto) {
    this.logger.debug(RabbitRouting.NewPost, dto);
    return this.rabbitClient.publish(this.rabbitOptions.exchange, RabbitRouting.NewPost, dto);
  }
}
