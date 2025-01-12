import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './comment.repository';
import { CommentFactory } from './comment.factory';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentFactory: CommentFactory
  ) {}

  getById(commentId: string) {
    return this.commentRepository.findById(commentId);
  }

  async findAll(postId: string) {
    return this.commentRepository.findAll(postId);
  }

  async create(postId: string, dto: CreateCommentDto) {
    try {
      const newComment = this.commentFactory.createFromDto(dto, postId);
      await this.commentRepository.save(newComment);

      return newComment;
    } catch (err) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }

  async delete(commentId: string) {
    const existsComment = await this.commentRepository.findById(commentId);
    if (!existsComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return await this.commentRepository.deleteById(commentId);
  }
}
