import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogPostModule } from '@project/blog-post';
import { BlogCommentModule } from '@project/blog-comment';

@Module({
  imports: [BlogPostModule, BlogCommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
