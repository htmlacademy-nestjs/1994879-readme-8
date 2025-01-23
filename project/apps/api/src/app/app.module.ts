import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, rabbitMQConfig } from '@project/app-config';
import { HttpModule } from '@nestjs/axios';
import { getHttpAsyncOptions } from '@project/app-config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UsersController } from './controllers/users.controller';
import { BlogController } from './controllers/blog.controller';
import { NotifyModule } from '@project/api-notify';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    HttpModule.register(getHttpAsyncOptions()),
    NotifyModule,
  ],
  controllers: [UsersController, BlogController],
  providers: [CheckAuthGuard, AppService],
})
export class AppModule {}
