import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from '@project/blog-post';
import { CommentModule } from '@project/blog-comment';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';

@Module({
  imports: [
    PostModule,
    CommentModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
