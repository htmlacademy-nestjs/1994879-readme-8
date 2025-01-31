import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';
import { HttpModule } from '@nestjs/axios';
import { getHttpAsyncOptions } from '@project/app-config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UsersController } from './users/users.controller';
import { BlogController } from './blog/blog.controller';
import { NotifyModule } from '@project/api-notify';
import { AppService } from './app.service';
import { gatewayConfig } from '@project/api-config';
import { UserService } from './users/user.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InjectUserIdInterceptor } from '../../../../libs/shared/interceptors/src/lib/inject-user-id.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, gatewayConfig],
    }),
    HttpModule.register(getHttpAsyncOptions()),
    NotifyModule,
  ],
  controllers: [UsersController, BlogController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectUserIdInterceptor,
    },
    CheckAuthGuard,
    AppService,
    UserService,
  ],
})
export class AppModule {}
