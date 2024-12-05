import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';

@Controller('comments')
export class BlogCommentController {
  constructor(
    private readonly commentService: BlogCommentService
  ) {}

  @Post()
  create(@Body() createBlogCommentModuleDto: CreateBlogCommentDto) {
    return this.commentService.create(createBlogCommentModuleDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogCommentModuleDto: UpdateBlogCommentDto
  ) {
    return this.commentService.update(
      +id,
      updateBlogCommentModuleDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
