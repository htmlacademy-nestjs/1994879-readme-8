import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { UserRDO } from '@project/blog-user';
import { AppHeader, AppRoute } from '@project/core';
import { getAppHeaders, getAppURL } from '@project/helpers';

@Injectable()
export class NotifyService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async renewalPosts(req: Request, userId: string) {
    const headers = getAppHeaders(req, AppHeader.UserId, AppHeader.Auth);
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, userId),
      { headers }
    );

    const { data: lastNotificationDate } = await this.httpService.axiosRef.get(
      getAppURL(this.baseUrl.notify, 'last-notify'),
      { headers }
    );

    const params = {
      date: lastNotificationDate,
    };
    const { data: posts } = await this.httpService.axiosRef.get(
      getAppURL(this.baseUrl.blog, AppRoute.Post),
      { headers, params }
    );

    await this.httpService.axiosRef.post(getAppURL(this.baseUrl.notify, AppRoute.Post), {
      subscribers: user.subscribers,
      post: posts,
    });
  }
}
