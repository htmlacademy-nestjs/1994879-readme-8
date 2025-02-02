import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostFactory } from './post.factory';
import { PrismaClientModule, PrismaClientService } from '@project/models';

@Module({
  imports: [PrismaClientModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostFactory],
  exports: [PostService],
})
export class PostModule {}
