import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeFactory } from './like.factory';
import { LikeRepository } from './like.repository';
import { PrismaClientModule } from '@project/models';
import { PostService, PostModule } from '@project/blog-post';
import { LikeController } from './like.controller';

@Module({
  imports: [PrismaClientModule, PostModule],
  providers: [LikeService, LikeRepository, LikeFactory],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
