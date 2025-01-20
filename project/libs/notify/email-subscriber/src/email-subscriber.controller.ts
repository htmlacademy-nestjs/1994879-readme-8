import { Controller, Inject } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { RabbitRouting } from '@project/core';
import { MailService } from './mail-module/mail.service';

@Controller()
export class EmailSubscriberController {
  constructor(
    @Inject(EmailSubscriberService) private readonly subscriberService: EmailSubscriberService,
    @Inject(MailService) private readonly mailService: MailService
  ) {}

  @RabbitSubscribe({
    exchange: 'readme.notify',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readme.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }
}
