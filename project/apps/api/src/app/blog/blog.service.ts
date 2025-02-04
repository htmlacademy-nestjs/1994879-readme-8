import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { CommentRDO } from '@project/blog-comment';
import { PostQuery, PostRDO } from '@project/blog-post';
import { AppHeader, AppRoute, PaginationQuery, PaginationResult } from '@project/core';
import { getAppHeaders, getAppURL } from '@project/helpers';
import { CommentWithPaginationRDO } from '@project/blog-comment';
import { CreateBlogCommentDTO } from '../dto/create-blog-comment.dto';
import { AuthorRDO } from '../rdo/author.rdo';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async appendUserInfo(
    req: Request,
    postsOrComments: PostRDO | PostRDO[] | CommentRDO | CommentRDO[]
  ) {
    const items = Array.isArray(postsOrComments) ? postsOrComments : [postsOrComments];
    const uniqueUserIds = [...new Set(items.map(({ userId }) => userId))];
    this.logger.debug('uniqueUserIds', uniqueUserIds);

    try {
      const headers = getAppHeaders(req, AppHeader.RequestId);
      const response = await this.httpService.axiosRef.get<AuthorRDO[]>(
        getAppURL(this.baseUrl.account, AppRoute.User),
        { headers, params: { userIds: uniqueUserIds } }
      );
      const userMap = new Map(response.data.map((user) => [user.id, user]));

      items.forEach((item) => {
        item['user'] = userMap.get(item.userId) || null;
      });
    } catch (error) {
      this.logger.error('Failed to fetch users:', error);
      items.forEach((item) => {
        item['user'] = null;
      });
    }
  }

  public async getPosts(req: Request, params: PostQuery): Promise<PaginationResult<PostRDO>> {
    const { data } = await this.httpService.axiosRef.get<PaginationResult<PostRDO>>(
      getAppURL(this.baseUrl.blog, AppRoute.Post),
      { params }
    );
    await this.appendUserInfo(req, data.entities);
    return data;
  }

  public async getPost(req: Request, postId: string): Promise<PostRDO> {
    const { data } = await this.httpService.axiosRef.get<PostRDO>(
      getAppURL(this.baseUrl.blog, AppRoute.Post, postId)
    );
    await this.appendUserInfo(req, data);
    return data;
  }

  public async deletePost(req: Request, postId: string): Promise<void> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.delete(
      getAppURL(this.baseUrl.blog, AppRoute.Post, postId),
      { headers }
    );
    return data;
  }

  public async createComment(
    req: Request,
    postId: string,
    dto: CreateBlogCommentDTO
  ): Promise<CommentRDO> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post<CommentRDO>(
      getAppURL(this.baseUrl.blog, AppRoute.Comment),
      { ...dto, postId },
      { headers }
    );
    await this.appendUserInfo(req, data);
    return data;
  }

  public async showComments(req: Request, postId: string, params: PaginationQuery) {
    const headers = getAppHeaders(req, AppHeader.RequestId);
    const { data } = await this.httpService.axiosRef.get<CommentWithPaginationRDO>(
      getAppURL(this.baseUrl.blog, AppRoute.Comment, postId),
      { headers, params }
    );
    await this.appendUserInfo(req, data.entities);
    return data;
  }

  public async deleteComment(req: Request, commentId: string): Promise<void> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.delete(
      getAppURL(this.baseUrl.blog, AppRoute.Comment, commentId),
      { headers }
    );
    return data;
  }

  public async createRepost(req: Request, postId: string): Promise<PostRDO> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.blog, AppRoute.Post, postId, AppRoute.Repost),
      null,
      { headers }
    );
    return data;
  }
}
