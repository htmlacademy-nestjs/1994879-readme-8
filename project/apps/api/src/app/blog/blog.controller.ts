import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Req,
  SerializeOptions,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { PostQuery } from '@project/blog-post';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { TokenName } from '@project/helpers';
import { ApiCustomResponse, UserId } from '@project/decorators';
import {
  AppRoute,
  PaginationQuery,
  PostStatus,
  SwaggerOperation,
  SwaggerPostProperty,
  SwaggerResponse,
  SwaggerTag,
} from '@project/core';
import { BlogService } from './blog.service';
import { CreateBlogCommentDTO } from '../dto/create-blog-comment.dto';
import { BlogCommentRDO } from '../rdo/blog-comment.rdo';
import { BlogCommentWithPaginationRDO } from '../rdo/blog-comment-witt-pagination.rdo';
import { BlogPostWithPaginationRDO } from '../rdo/blog-post-witt-pagination.rdo';
import { BlogPostRDO } from '../rdo/blog-post.rdo';
import { DEFAULT_SEARCH_LIMIT } from './const';
import { SwaggerCommentProperty } from '@project/core';
import { UpdatePostDTO } from '@project/blog-post';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoLimit } from '../app.const';
import { CreateBlogPostDTO } from '../dto/create-blog-post.dto';

@Controller(AppRoute.Blog)
@ApiTags(SwaggerTag.Blog)
@UseFilters(AxiosExceptionFilter)
@ApiCustomResponse()
export class BlogController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(BlogService) private blogService: BlogService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  @Get(AppRoute.Post)
  @ApiOperation({ summary: SwaggerOperation.PostAll })
  @ApiOkResponse({ type: BlogPostWithPaginationRDO })
  @SerializeOptions({ type: BlogPostWithPaginationRDO, excludeExtraneousValues: true })
  public async getPosts(@Query() queryParams: PostQuery, @Req() req: Request) {
    return this.blogService.getPosts(req, queryParams);
  }

  @Get(AppRoute.PostById)
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  @ApiOkResponse({ type: BlogPostRDO })
  @SerializeOptions({ type: BlogPostRDO, excludeExtraneousValues: true })
  public async getPost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    return this.blogService.getPost(req, postId);
  }

  @Post(AppRoute.Post)
  @ApiOperation({ summary: SwaggerOperation.PostCreate })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: BlogPostRDO })
  @SerializeOptions({ type: BlogPostRDO, excludeExtraneousValues: true })
  public async create(
    @Body() dto: CreateBlogPostDTO,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: PhotoLimit.MaxSize })
        .addFileTypeValidator({ fileType: PhotoLimit.AvailableTypes })
        .build({ fileIsRequired: false })
    )
    photo?: Express.Multer.File
  ) {
    return this.blogService.createPost(req, dto, photo);
  }

  @Patch(AppRoute.PostById)
  @ApiOperation({ summary: SwaggerOperation.PostUpdate })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse({ type: BlogPostRDO })
  @SerializeOptions({ type: BlogPostRDO, excludeExtraneousValues: true })
  public async update(
    @Param(AppRoute.PostId) postId: string,
    @Body() dto: UpdatePostDTO,
    @Req() req: Request
  ) {
    return this.blogService.updatePost(req, postId, dto);
  }

  @Delete(AppRoute.PostById)
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiNoContentResponse({ description: SwaggerResponse.PostDeleted })
  public async deletePost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    return this.blogService.deletePost(req, postId);
  }

  @Post(`${AppRoute.PostById}/${AppRoute.Like}`)
  @ApiOperation({ summary: SwaggerOperation.Like })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerResponse.LikeSuccess })
  @ApiConflictResponse({ description: SwaggerResponse.LikeExists })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  public async likePost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    return this.blogService.likePost(req, postId);
  }

  @Delete(`${AppRoute.PostById}/${AppRoute.Like}`)
  @ApiOperation({ summary: SwaggerOperation.Unlike })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerResponse.LikeDeleted })
  @ApiNotFoundResponse({ description: SwaggerResponse.LikeNotFound })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  public async unlikePost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    return this.blogService.unlikePost(req, postId);
  }

  @Post(AppRoute.PostComment)
  @ApiOperation({ summary: SwaggerOperation.CommentCreate })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  @ApiCreatedResponse({ type: BlogCommentRDO })
  @SerializeOptions({ type: BlogCommentRDO, excludeExtraneousValues: true })
  public async createComment(
    @Param(AppRoute.PostId) postId: string,
    @Body() dto: CreateBlogCommentDTO,
    @Req() req: Request
  ) {
    return this.blogService.createComment(req, postId, dto);
  }

  @Get(AppRoute.PostComment)
  @ApiOperation({ summary: SwaggerOperation.CommentList })
  @ApiOkResponse({ type: BlogCommentWithPaginationRDO })
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  @SerializeOptions({ type: BlogCommentWithPaginationRDO, excludeExtraneousValues: true })
  public async showComments(
    @Param(AppRoute.PostId) postId: string,
    @Query() params: PaginationQuery,
    @Req() req: Request
  ) {
    return this.blogService.showComments(req, postId, params);
  }

  @Delete(`${AppRoute.PostComment}/:${AppRoute.CommentId}`)
  @ApiOperation({ summary: SwaggerOperation.CommentDelete })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiParam({ name: AppRoute.CommentId, ...SwaggerCommentProperty.commentId })
  @ApiCreatedResponse()
  public async deleteComment(@Param(AppRoute.CommentId) commentId: string, @Req() req: Request) {
    return this.blogService.deleteComment(req, commentId);
  }

  @Post(AppRoute.PostRepost)
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOperation({ summary: SwaggerOperation.Repost })
  @ApiCreatedResponse({ description: SwaggerResponse.PostCreated })
  async repost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    return this.blogService.createRepost(req, postId);
  }

  @Get(AppRoute.Search)
  @ApiOperation({ summary: SwaggerOperation.Search })
  @ApiOkResponse({ description: SwaggerResponse.PostList })
  @ApiQuery({ name: AppRoute.Title, ...SwaggerPostProperty.title })
  async search(@Query(AppRoute.Title) title: string, @Req() req: Request) {
    return this.getPosts({ title, limit: DEFAULT_SEARCH_LIMIT }, req);
  }

  @Get(AppRoute.Draft)
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOperation({ summary: SwaggerOperation.Draft })
  @ApiOkResponse({ type: BlogPostWithPaginationRDO })
  async getDraft(@UserId() userId: string, @Req() req: Request) {
    return this.getPosts({ postStatus: PostStatus.Draft, userIds: [userId] }, req);
  }
}
