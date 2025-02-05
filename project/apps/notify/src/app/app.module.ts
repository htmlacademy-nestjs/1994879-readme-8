import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, getMongooseOptions } from '@project/app-config';
import { EmailSubscriberModule } from '@project/email-subscriber';
import { NotifyConfigModule } from '@project/notify-config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from '@project/interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotifyConfigModule,
    EmailSubscriberModule,
  ],
})
export class AppModule {}
