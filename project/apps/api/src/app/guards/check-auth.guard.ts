import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { gatewayConfig } from '@project/api-config';
import { ConfigType } from '@nestjs/config';
import { getAppHeaders, getAppURL } from '@project/helpers';
import { AppHeader, AppRoute } from '@project/core';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = getAppHeaders(request, AppHeader.Auth);
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, AppRoute.Auth, AppRoute.Check),
      {},
      { headers }
    );

    request['user'] = data;
    return true;
  }
}
