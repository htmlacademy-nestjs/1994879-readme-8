import { Module } from '@nestjs/common';
import { PostModule } from '@project/blog-post';
import { CommentModule } from '@project/blog-comment';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from '@project/interceptors';

@Module({
  imports: [
    PostModule,
    CommentModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule {}
