import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  SerializeOptions,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostOperationSummary, PostResponseDescription, PostSwaggerQuery } from './post.constant';
import { PostRDO } from './rdo/post.rdo';
import { PostQuery } from './post.query';
import { PostWithPaginationRDO } from './rdo/post-with-pagination.rdo';
import { SwaggerTag } from '@project/core';

@ApiTags(SwaggerTag.Post)
@Controller('posts')
@SerializeOptions({ type: PostRDO, excludeExtraneousValues: true })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: PostOperationSummary.Create })
  @ApiResponse({ status: HttpStatus.CREATED, description: PostResponseDescription.Created })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: PostResponseDescription.BadRequest })
  async create(@Body() dto: CreatePostDTO) {
    return this.postService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: PostOperationSummary.FindAll })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostWithPaginationRDO,
    description: PostResponseDescription.AllPosts,
  })
  @SerializeOptions({ type: PostWithPaginationRDO, excludeExtraneousValues: true })
  async findAll(@Query() query: PostQuery) {
    const postsWithPagination = await this.postService.findAll(query);
    return postsWithPagination;
  }

  @Get(':id')
  @ApiOperation({ summary: PostOperationSummary.FindOne })
  @ApiResponse({ status: HttpStatus.OK, description: PostResponseDescription.Found })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostResponseDescription.NotFound })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: PostOperationSummary.Update })
  @ApiResponse({ status: HttpStatus.OK, description: PostResponseDescription.Updated })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostResponseDescription.NotFound })
  async update(@Param('id') id: string, @Body() dto: UpdatePostDTO) {
    return this.postService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: PostOperationSummary.Remove })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: PostResponseDescription.Deleted })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostResponseDescription.NotFound })
  async remove(@Param('id') id: string) {
    await this.postService.remove(id);
  }
}
