import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';
import { HttpModule } from '@nestjs/axios';
import { getHttpAsyncOptions } from '@project/app-config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UsersController } from './controllers/users.controller';
import { BlogController } from './controllers/blog.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    HttpModule.register(getHttpAsyncOptions()),
  ],
  controllers: [UsersController, BlogController],
  providers: [CheckAuthGuard],
})
export class AppModule {}
