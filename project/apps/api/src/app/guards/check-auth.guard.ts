import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { gatewayConfig } from '@project/api-config';
import { ConfigType } from '@nestjs/config';
import { getAppURL } from '@project/helpers';
import { AppRoute } from '@project/core';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, AppRoute.Auth, AppRoute.Check),
      {},
      {
        headers: {
          Authorization: request.headers['authorization'],
        },
      }
    );

    request['user'] = data;
    return true;
  }
}
