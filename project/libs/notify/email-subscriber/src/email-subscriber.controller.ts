import { Controller, Inject, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDTO } from './dto/create-subscriber.dto';
import { RabbitRouting } from '@project/core';
import { MailService } from './mail-module/mail.service';
import { RabbitConfig } from '../constant';
import { NotifyNewPostsDTO } from './dto/notify-new-post.dto';

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
    queue: RabbitConfig.QueueUser,
  })
  public async create(subscriber: CreateSubscriberDTO) {
    this.logger.debug(RabbitRouting.AddSubscriber);
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: RabbitConfig.Exchange,
    routingKey: RabbitRouting.NewPost,
    queue: RabbitConfig.QueuePost,
  })
  public async notifyNewPost(dto: NotifyNewPostsDTO) {
    this.logger.debug(RabbitRouting.NewPost);

    await Promise.all(
      dto.subscribers.map(async (subscriber) => {
        try {
          await this.mailService.sendRenewalPosts(subscriber, dto.entities);
        } catch (error) {
          this.logger.error(
            `Failed to send email to subscriber ${subscriber.email}:`,
            JSON.stringify(error)
          );
        }
      })
    );
  }
}
