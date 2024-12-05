import { Injectable } from '@nestjs/common';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';

@Injectable()
export class BlogCommentService {
  create(_dto: CreateBlogCommentDto) {
    return 'This action adds a new blogCommentModule';
  }

  findAll() {
    return `This action returns all blogCommentModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogCommentModule`;
  }

  update(id: number, dto: UpdateBlogCommentDto) {
    return `This action updates a #${id} blogCommentModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogCommentModule`;
  }
}
