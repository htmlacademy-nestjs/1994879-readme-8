import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeFactory } from './like.factory';
import { LikeRepository } from './like.repository';

@Module({
  providers: [LikeService, LikeRepository, LikeFactory],
  exports: [LikeService],
})
export class LikeModule {}
