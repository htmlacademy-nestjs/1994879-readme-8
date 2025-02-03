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
import { PostQuery } from './queries/post.query';
import {
  AppRoute,
  SwaggerOperation,
  SwaggerTag,
  SwaggerPostProperty,
  AppHeader,
} from '@project/core';
import { ApiCustomResponse, ApiPostBody, UserId } from '@project/decorators';
import { XUserIdGuard } from '@project/interceptors';
import { PostWithPaginationRDO } from './rdo/post-with-pagination.rdo';

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
    return await this.postService.findAll(query);
  }

  @Get(`:${AppRoute.PostId}`)
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  @ApiOkResponse({ description: PostResponseDescription.Found })
  @ApiNotFoundResponse({ description: PostResponseDescription.NotFound })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  async findOne(@Param(AppRoute.PostId) postId: string) {
    return this.postService.getById(postId);
  }

  @Patch(`:${AppRoute.PostId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostUpdate })
  @ApiOkResponse({ description: PostResponseDescription.Updated })
  @ApiNotFoundResponse({ description: PostResponseDescription.NotFound })
  async update(
    @Param(AppRoute.PostId) postId: string,
    @Headers(AppHeader.UserId) userId: string,
    @Body() dto: UpdatePostDTO
  ) {
    return this.postService.update(postId, userId, dto);
  }

  @Delete(`:${AppRoute.PostId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostRemove })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: PostResponseDescription.Deleted })
  @ApiNotFoundResponse({ description: PostResponseDescription.NotFound })
  async remove(@Param(AppRoute.PostId) postId: string, @Headers(AppHeader.UserId) userId: string) {
    await this.postService.remove(postId, userId);
  }

  @Get(AppRoute.Count)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostCount })
  @ApiOkResponse({ description: PostResponseDescription.PostCount })
  public async getUserPostsCount(@Headers(AppHeader.UserId) userId: string): Promise<number> {
    return this.postService.getUserPostsCount(userId);
  }
}
