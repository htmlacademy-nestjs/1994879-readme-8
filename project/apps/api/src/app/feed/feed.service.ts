import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { SubscribeDTO, UserRDO } from '@project/blog-user';
import { AppHeader, AppRoute, PaginationResult, PostStatus } from '@project/core';
import { getAppHeaders, getAppURL } from '@project/helpers';
import { BlogService } from '../blog/blog.service';
import { FeedQuery } from './feed.query';
import { PostRDO } from '@project/blog-post';

@Injectable()
export class FeedService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(BlogService) private readonly blogService: BlogService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async subscribe(dto: SubscribeDTO, req: Request): Promise<void> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.Auth);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, AppRoute.User, AppRoute.Subscribe),
      dto,
      { headers }
    );
    return data;
  }

  public async unsubscribe(dto: SubscribeDTO, req: Request): Promise<void> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.Auth);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, AppRoute.User, AppRoute.Unsubscribe),
      dto,
      { headers }
    );
    return data;
  }

  public async feed(
    userId: string,
    query: FeedQuery,
    req: Request
  ): Promise<PaginationResult<PostRDO>> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.Auth);
    const { data } = await this.httpService.axiosRef.get<UserRDO[]>(
      getAppURL(this.baseUrl.account, AppRoute.User, AppRoute.Subscriptions),
      { headers }
    );

    const subscriptions = data.map(({ id }) => id);

    const userIds = [userId, ...subscriptions];
    const userPostsFeed = await this.blogService.getPosts(req, {
      ...query,
      userIds,
      postStatus: PostStatus.Published,
    });

    return userPostsFeed;
  }
}
