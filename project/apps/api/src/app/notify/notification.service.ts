import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { NotifyService } from '@project/api-notify';
import { UserRDO } from '@project/blog-user';
import { AppHeader, AppRoute, PaginationResult, PostStatus } from '@project/core';
import { getAppHeaders, getAppURL } from '@project/helpers';
import { MESSAGE, SUBSCRIBERS_NOT_FOUND } from './const';
import { PostQuery, PostRDO } from '@project/blog-post';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(NotifyService) private readonly notifyService: NotifyService
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async renewalPosts(req: Request, userId: string) {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId, AppHeader.Auth);
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, userId),
      { headers }
    );

    if (!user.subscribers?.length) {
      throw new NotFoundException(MESSAGE.SUBSCRIBERS_NOT_FOUND);
    }

    const params: PostQuery = {
      fromDate: user.subscribersNotifyDate,
      postStatus: PostStatus.Published,
      userIds: [userId]
    };
    const { data } = await this.httpService.axiosRef.get<PaginationResult<PostRDO>>(
      getAppURL(this.baseUrl.blog, AppRoute.Post),
      { headers, params }
    );

    if (data.totalItems === 0) {
      throw new NotFoundException(MESSAGE.NEW_POSTS_NOT_FOUND);
    }

          const response = await this.httpService.axiosRef.get<AuthorRDO[]>(
            getAppURL(this.baseUrl.account, AppRoute.User),
            { headers, params: { userIds: uniqueUserIds } }
          );


    this.notifyService.renewalPosts({
      subscribers: user.subscribers,
      entities: data.entities,
    });
  }
}
