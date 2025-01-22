import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Subscriber } from '@project/core';
import { mailConfig } from '@project/app-config';
import { EMAIL_ADD_SUBSCRIBER_SUBJECT } from './mail.constant';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(mailConfig.KEY) private readonly mailOptions: ConfigType<typeof mailConfig>;

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.mailOptions.from,
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: './add-subscriber',
      context: {
        user: `${subscriber.name}`,
        email: `${subscriber.email}`,
      },
    });
  }
}
