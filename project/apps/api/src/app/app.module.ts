import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';
import { HttpModule } from '@nestjs/axios';
import { getHttpAsyncOptions } from '@project/app-config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserController } from './users/user.controller';
import { BlogController } from './blog/blog.controller';
import { AppService } from './app.service';
import { gatewayConfig } from '@project/api-config';
import { UserService } from './users/user.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InjectUserIdInterceptor, RequestIdInterceptor } from '@project/interceptors';
import { NotificationController } from './notify/notification.controller';
import { NotificationService } from './notify/notification.service';
import { BlogService } from './blog/blog.service';
import { FeedController } from './feed/feed.controller';
import { FeedService } from './feed/feed.service';
import { NotifyModule } from '@project/api-notify';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, gatewayConfig],
    }),
    HttpModule.register(getHttpAsyncOptions()),
    NotifyModule,
  ],
  controllers: [UserController, BlogController, NotificationController, FeedController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectUserIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    CheckAuthGuard,
    AppService,
    UserService,
    BlogService,
    FeedService,
    NotificationService,
  ],
})
export class AppModule {}
