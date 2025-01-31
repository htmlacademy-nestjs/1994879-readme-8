import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { PostRDO } from '@project/blog-post';
import { AppRoute } from '@project/core';
import { getAppURL } from '@project/helpers';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async appendUserInfo(posts: PostRDO[]) {
    const result = await Promise.allSettled(
      posts.map((post) =>
        this.httpService.axiosRef.get(getAppURL(this.baseUrl.account, AppRoute.User, post.userId))
      )
    );
    result.filter((r) => r.status === 'rejected').forEach((i) => this.logger.error);
  }
}
