import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Subscriber } from '@project/core';
import { mailConfig } from '@project/app-config';
import { NotifyNewPostDTO } from '../dto/notify-new-post.dto';
import { MailConfig } from './mail.constant';

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

  public async sendNotifyNewPost(subscriber: Subscriber, postData: NotifyNewPostDTO) {
    await this.mailerService.sendMail({
      ...MailConfig.newPost,
      from: this.mailOptions.from,
      to: subscriber.email,
      context: { user: subscriber.name, ...postData },
    });
  }
}
