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
  UsePipes,
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
import { PostRDO } from './rdo/post.rdo';
import { PostQuery } from './queries/post.query';
import {
  AppRoute,
  SwaggerOperation,
  SwaggerTag,
  SwaggerPostProperty,
  AppHeader,
  SwaggerResponse,
} from '@project/core';
import { ApiCustomResponse, ApiPostBody, UserId } from '@project/decorators';
import { XUserIdGuard } from '@project/interceptors';
import { PostWithPaginationRDO } from './rdo/post-with-pagination.rdo';
import { CreatePostValidationPipe } from '@project/pipes';

@ApiTags(SwaggerTag.Post)
@Controller(AppRoute.Post)
@SerializeOptions({ type: PostRDO, excludeExtraneousValues: true })
@ApiCustomResponse()
export class PostController {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Get(AppRoute.Count)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostCount })
  @ApiOkResponse({ description: SwaggerResponse.PostCount })
  public async getUserPostsCount(@Headers(AppHeader.UserId) userId: string): Promise<number> {
    return this.postService.getUserPostsCount(userId);
  }

  @Post()
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostCreate })
  @ApiCreatedResponse({ description: SwaggerResponse.PostCreated })
  @ApiPostBody('type', VideoPostDTO, TextPostDTO, LinkPostDTO, PhotoPostDTO, QuotePostDTO)
  @UsePipes(CreatePostValidationPipe)
  async create(@Body() dto: CreatePostDTO, @Headers(AppHeader.UserId) userId: string) {
    return this.postService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: SwaggerOperation.PostAll })
  @ApiOkResponse({
    type: PostWithPaginationRDO,
    description: SwaggerResponse.PostList,
  })
  @SerializeOptions({ type: PostWithPaginationRDO, excludeExtraneousValues: true })
  async findAll(@Query() query: PostQuery) {
    return await this.postService.findAll(query);
  }

  @Get(`:${AppRoute.PostId}`)
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  @ApiOkResponse({ description: SwaggerResponse.PostFound })
  @ApiNotFoundResponse({ description: SwaggerResponse.PostNotFound })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  async findOne(@Param(AppRoute.PostId) postId: string) {
    return this.postService.getById(postId);
  }

  @Patch(`:${AppRoute.PostId}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.PostUpdate })
  @ApiOkResponse({ description: SwaggerResponse.PostUpdated })
  @ApiNotFoundResponse({ description: SwaggerResponse.PostNotFound })
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
  @ApiNoContentResponse({ description: SwaggerResponse.PostDeleted })
  @ApiNotFoundResponse({ description: SwaggerResponse.PostNotFound })
  async remove(@Param(AppRoute.PostId) postId: string, @Headers(AppHeader.UserId) userId: string) {
    await this.postService.remove(postId, userId);
  }

  @Post(`:${AppRoute.PostId}/${AppRoute.Repost}`)
  @UseGuards(XUserIdGuard)
  @ApiOperation({ summary: SwaggerOperation.Repost })
  @ApiCreatedResponse({ description: SwaggerResponse.PostCreated })
  async repost(@Param(AppRoute.PostId) postId: string, @Headers(AppHeader.UserId) userId: string) {
    return this.postService.createRepost(postId, userId);
  }
}
