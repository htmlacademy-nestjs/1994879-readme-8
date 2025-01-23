import { Controller, Inject, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { RabbitRouting } from '@project/core';
import { MailService } from './mail-module/mail.service';
import { RabbitConfig } from '../constant';
import { NotifyNewPostDto } from './dto/notify-new-post.dto';

@Controller()
export class EmailSubscriberController {
  private readonly logger = new Logger(EmailSubscriberController.name);

  constructor(
    @Inject(EmailSubscriberService) private readonly subscriberService: EmailSubscriberService,
    @Inject(MailService) private readonly mailService: MailService
  ) {}

  @RabbitSubscribe({
    exchange: RabbitConfig.Exchange,
    routingKey: RabbitRouting.AddSubscriber,
    queue: RabbitConfig.Queue,
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.logger.debug(RabbitRouting.AddSubscriber);
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: RabbitConfig.Exchange,
    routingKey: RabbitRouting.NewPost,
    queue: RabbitConfig.Queue,
  })
  public async notifyNewPost(post: NotifyNewPostDto) {
    this.logger.debug(RabbitRouting.NewPost, post);

    if (!(post instanceof NotifyNewPostDto)) {
      return;
    }

    const subscribers = await this.subscriberService.findAll();
    await Promise.all(
      subscribers.map(async (subscriber) => {
        try {
          await this.mailService.sendNotifyNewPost(subscriber, post);
        } catch (error) {
          this.logger.error(`Failed to send email to subscriber ${subscriber.email}:`, error);
        }
      })
    );
  }
}
