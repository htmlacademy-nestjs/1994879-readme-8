import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/authentication';
import { ConfigModule } from '@nestjs/config';
import { appConfig, getMongooseOptions } from '@project/app-config';
import { AccountConfigModule } from '@project/account-config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from '@project/interceptors';

@Module({
  imports: [
    BlogUserModule,
    AuthenticationModule,
    AccountConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: RequestLoggerInterceptor }],
})
export class AppModule {}
