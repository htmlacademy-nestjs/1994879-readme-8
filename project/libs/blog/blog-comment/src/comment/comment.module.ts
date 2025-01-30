import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentFactory } from './comment.factory';
import { PrismaClientModule } from '@project/models';

@Module({
  imports: [PrismaClientModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, CommentFactory],
  exports: [CommentService],
})
export class CommentModule {}
