import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { AddNewPostDTO } from '../dto/add-new-post.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserRDO } from '@project/blog-user';
import { PostRDO } from '@project/blog-post';
import { PostQuery } from '@project/blog-post';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { getAppHeaders, getAppURL, TokenName } from '@project/helpers';
import { ApiCustomResponse, UserId } from '@project/decorators';
import {
  AppHeader,
  AppRoute,
  PaginationQuery,
  PaginationResult,
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
  public async create(@Body() dto: AddNewPostDTO, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<PostRDO>(
      getAppURL(this.baseUrl.blog),
      dto
    );
    await this.blogService.appendUserInfo(req, data);
    return data;
  }

  @Delete(AppRoute.PostById)
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiNoContentResponse({ description: SwaggerResponse.PostDeleted })
  public async deletePost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    return this.blogService.deletePost(req, postId);
  }

  @Get(AppRoute.Feed)
  @ApiOperation({ summary: SwaggerOperation.Feed })
  @ApiOkResponse({ description: SwaggerResponse.Feed })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async getUserFeed(@UserId() userId: string, @Req() req: Request) {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.Auth);
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, `${userId}`),
      { headers }
    );

    const userIds = [user.id, ...user.subscribers];
    const userPostsFeed = await this.getPosts({ userIds }, req);

    return userPostsFeed;
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
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.blog, AppRoute.Like, postId),
      {},
      { headers }
    );

    return data;
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
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.blog, AppRoute.Like, postId),
      {},
      { headers }
    );

    return data;
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
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  @ApiParam({ name: AppRoute.CommentId })
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
}
