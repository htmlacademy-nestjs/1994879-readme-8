import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostFactory } from './post.factory';
import { PrismaClientService } from '@project/models';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PostFactory, PrismaClientService],
})
export class PostModule {}
