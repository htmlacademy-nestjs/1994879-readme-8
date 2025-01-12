import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentFactory } from './comment.factory';
import { PrismaClientService } from '@project/models';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, CommentFactory, PrismaClientService],
})
export class CommentModule {}
