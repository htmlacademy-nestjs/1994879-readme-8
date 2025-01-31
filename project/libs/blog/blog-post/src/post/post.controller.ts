import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  Query,
  Inject,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostDTO,
  LinkPostDTO,
  PhotoPostDTO,
  QuotePostDTO,
  TextPostDTO,
  VideoPostDTO,
} from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostResponseDescription } from './post.constant';
import { PostRDO } from './rdo/post.rdo';
import { PostQuery } from './post.query';
import { PostWithPaginationRDO } from './rdo/post-with-pagination.rdo';
import {
  AppRoute,
  SwaggerOperation,
  SwaggerTag,
  SwaggerPostProperty,
  AppHeader,
} from '@project/core';
import { ApiCustomResponse, ApiPostBody, UserId } from '@project/decorators';
import { XUserIdGuard } from '@project/interceptors';

@ApiTags(SwaggerTag.Post)
@Controller(AppRoute.Post)
@SerializeOptions({ type: PostRDO, excludeExtraneousValues: true })
@ApiCustomResponse()
export class PostController {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: SwaggerOperation.PostCreate })
  @ApiCreatedResponse({ description: PostResponseDescription.Created })
  @ApiPostBody('type', VideoPostDTO, TextPostDTO, LinkPostDTO, PhotoPostDTO, QuotePostDTO)
  async create(@Body() dto: CreatePostDTO) {
    return this.postService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: SwaggerOperation.PostAll })
  @ApiOkResponse({
    type: PostWithPaginationRDO,
    description: PostResponseDescription.AllPosts,
  })
  @SerializeOptions({ type: PostWithPaginationRDO, excludeExtraneousValues: true })
  async findAll(@Query() query: PostQuery) {
    const postsWithPagination = await this.postService.findAll(query);
    return postsWithPagination;
  }

  @Get(':id')
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  @ApiOkResponse({ description: PostResponseDescription.Found })
  @ApiNotFoundResponse({ description: PostResponseDescription.NotFound })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostUpdate })
  @ApiOkResponse({ description: PostResponseDescription.Updated })
  @ApiNotFoundResponse({ description: PostResponseDescription.NotFound })
  async update(
    @Param('id') id: string,
    @Headers(AppHeader.UserId) userId: string,
    @Body() dto: UpdatePostDTO
  ) {
    return this.postService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostRemove })
  @ApiNoContentResponse({ description: PostResponseDescription.Deleted })
  @ApiNotFoundResponse({ description: PostResponseDescription.NotFound })
  async remove(@Param('id') id: string, @Headers(AppHeader.UserId) userId: string) {
    this.postService.remove(id, userId);
  }

  @Get(AppRoute.Count)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostCount })
  @ApiOkResponse({ description: PostResponseDescription.PostCount })
  public async getUserPostsCount(@Headers(AppHeader.UserId) userId: string): Promise<number> {
    return this.postService.getUserPostsCount(userId);
  }

  @Post(`:postId/${AppRoute.Like}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.Like })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'postId', ...SwaggerPostProperty.postId })
  public async likePost(
    @Param('postId') postId: string,
    @Headers(AppHeader.UserId) userId: string
  ) {
    return this.postService.like(postId, userId);
  }

  @Delete(`:postId/${AppRoute.Like}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.Unlike })
  @ApiNoContentResponse()
  @ApiParam({ name: 'postId', ...SwaggerPostProperty.postId })
  public async unlikePost(
    @Param('postId') postId: string,
    @Headers(AppHeader.UserId) userId: string
  ) {
    return this.postService.unlike(postId, userId);
  }
}
