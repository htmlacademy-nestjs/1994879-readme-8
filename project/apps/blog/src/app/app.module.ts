import { Module } from '@nestjs/common';
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
})
export class AppModule {}
