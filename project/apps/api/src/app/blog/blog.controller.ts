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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { AddNewPostDTO } from '../dto/add-new-post.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserRDO } from '@project/blog-user';
import { PostWithPaginationRDO } from '@project/blog-post';
import { PostQuery } from '@project/blog-post';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { getAppHeaders, getAppURL, TokenName } from '@project/helpers';
import { ApiCustomResponse, UserId } from '@project/decorators';
import { CreateCommentDTO } from '@project/blog-comment';
import {
  AppHeader,
  AppRoute,
  SwaggerOperation,
  SwaggerPostProperty,
  SwaggerResponse,
  SwaggerTag,
} from '@project/core';
import { BlogService } from './blog.service';

@Controller(AppRoute.Blog)
@ApiTags(SwaggerTag.Blog)
@UseGuards(CheckAuthGuard)
@UseFilters(AxiosExceptionFilter)
@ApiCustomResponse()
export class BlogController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(BlogService) private blogService: BlogService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  @Get()
  @ApiOperation({ summary: SwaggerOperation.PostOne })
  public async index(@Query() queryParams: PostQuery) {
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRDO>(
      getAppURL(this.baseUrl.blog, AppRoute.Post),
      { params: queryParams }
    );
    await this.blogService.appendUserInfo(data.entities);
    return data;
  }

  @Post()
  public async create(@Body() dto: AddNewPostDTO) {
    const { data } = await this.httpService.axiosRef.post<PostWithPaginationRDO>(
      getAppURL(this.baseUrl.blog),
      dto
    );
    await this.blogService.appendUserInfo(data.entities);
    return data;
  }

  @Get(AppRoute.Feed)
  @ApiOperation({ summary: SwaggerOperation.Feed })
  @ApiOkResponse({ description: SwaggerResponse.Feed })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async getUserFeed(@UserId() userId: string, @Req() req: Request) {
    const headers = getAppHeaders(req, AppHeader.Auth);
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, `${userId}`),
      { headers }
    );

    const userIds = [user.id, ...user.subscribers];
    const userPostsFeed = await this.index({ userIds });

    return userPostsFeed;
  }

  @Post(`${AppRoute.Post}/:${AppRoute.PostId}/${AppRoute.Like}`)
  @ApiOperation({ summary: SwaggerOperation.Like })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  public async likePost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    const headers = getAppHeaders(req, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.blog, AppRoute.Post, postId, AppRoute.Like),
      {},
      { headers }
    );

    return data;
  }

  @Delete(`${AppRoute.Post}/:${AppRoute.PostId}/${AppRoute.Like}`)
  @ApiOperation({ summary: SwaggerOperation.Unlike })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  public async unlikePost(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    const headers = getAppHeaders(req, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.blog, AppRoute.Post, postId, AppRoute.Like),
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
  @ApiCreatedResponse()
  public async createComment(
    @Body() dto: CreateCommentDTO,
    @Param(AppRoute.PostId) postId: string,
    @Req() req: Request
  ) {
    const headers = getAppHeaders(req, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.blog, AppRoute.Comment),
      { ...dto, postId },
      { headers }
    );
    return data;
  }

  @Get(AppRoute.PostComment)
  @ApiOperation({ summary: SwaggerOperation.CommentList })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  @ApiCreatedResponse()
  public async showComments(@Param(AppRoute.PostId) postId: string, @Req() req: Request) {
    const headers = getAppHeaders(req, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.get(
      getAppURL(this.baseUrl.blog, AppRoute.Comment),
      { headers, params: { postId } }
    );
    return data;
  }

  @Delete(`${AppRoute.PostComment}/${AppRoute.CommentId}`)
  @ApiOperation({ summary: SwaggerOperation.CommentDelete })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiParam({ name: AppRoute.PostId, ...SwaggerPostProperty.postId })
  @ApiParam({ name: AppRoute.CommentId })
  @ApiCreatedResponse()
  public async deleteComment(
    @Param(AppRoute.PostId) postId: string,
    @Param(AppRoute.CommentId) commentId: string,
    @Req() req: Request
  ) {
    const headers = getAppHeaders(req, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.delete(
      getAppURL(this.baseUrl.blog, AppRoute.Comment),
      { headers, params: { postId, commentId } }
    );
    return data;
  }
}
