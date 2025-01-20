import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigSpace, getMailerAsyncOptions } from '@project/app-config';

@Module({
  imports: [MailerModule.forRootAsync(getMailerAsyncOptions(ConfigSpace.Mail))],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
