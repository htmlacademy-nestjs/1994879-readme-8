import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Subscriber } from '@project/core';
import { mailConfig } from '@project/app-config';
import { MailConfig } from './mail.constant';
import { PostRDO } from '@project/blog-post';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(mailConfig.KEY) private readonly mailOptions: ConfigType<typeof mailConfig>;

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      ...MailConfig.addSubscriber,
      from: this.mailOptions.from,
      to: subscriber.email,
      context: {
        user: `${subscriber.name}`,
        email: `${subscriber.email}`,
      },
    });
  }

  public async sendRenewalPosts(subscriber: Subscriber, entities: PostRDO[]) {
    await this.mailerService.sendMail({
      ...MailConfig.newPost,
      from: this.mailOptions.from,
      to: subscriber.email,
      context: { user: subscriber.name, entities },
    });
  }
}
