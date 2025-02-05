import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentRepository } from './comment.repository';
import { CommentEntity } from './entities/comment.entity';
import { CommentMessage } from './comment.constant';
import { PaginationQuery } from '@project/core';

@Injectable()
export class CommentService {
  constructor(@Inject(CommentRepository) private readonly commentRepository: CommentRepository) {}

  public async getById(commentId: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException(CommentMessage.NotFound);
    }
    return comment;
  }

  public async findByPostId(postId: string, pagination: PaginationQuery) {
    return await this.commentRepository.findByPostId(postId, pagination);
  }

  public async create(dto: CreateCommentDTO, userId: string) {
    const newComment = new CommentEntity({ ...dto, userId });
    try {
      await this.commentRepository.save(newComment);
    } catch (error) {
      throw new ConflictException(CommentMessage.SaveError);
    }

    return newComment;
  }

  public async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.getById(commentId);
    if (comment.userId !== userId) {
      throw new ConflictException(CommentMessage.AccessDeny);
    }

    return await this.commentRepository.delete(comment.id);
  }
}
