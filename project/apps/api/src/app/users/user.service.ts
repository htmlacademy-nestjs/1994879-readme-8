import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { UserRDO, RegisterUserDTO, UserDetailedRDO } from '@project/blog-user';
import { getAppHeaders, getAppURL } from '@project/helpers';
import { AppService } from '../app.service';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO } from '@project/blog-user';
import { AppHeader, AppRoute, DEFAULT_AVATAR } from '@project/core';

@Injectable()
export class UserService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>,
    private readonly appService: AppService
  ) {}

  private getDefaultAvatar(): string {
    return getAppURL(this.baseUrl.file, DEFAULT_AVATAR);
  }

  public async getUserDetails(user: UserRDO, req: Request): Promise<UserDetailedRDO> {
    const headers = getAppHeaders(req, AppHeader.RequestId, AppHeader.UserId);
    const { data: publicationsCount } = await this.httpService.axiosRef.get<number>(
      getAppURL(this.baseUrl.blog, AppRoute.Post, AppRoute.Count),
      { headers }
    );
    return Object.assign(user, {
      publicationsCount,
      subscribersCount: user.subscribers.length,
    });
  }

  async register(dto: RegisterUserDTO, avatarFile?: Express.Multer.File): Promise<UserRDO> {
    const userDTO = plainToInstance(CreateUserDTO, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
      avatar: avatarFile ? await this.appService.uploadFile(avatarFile) : this.getDefaultAvatar(),
    });

    const { data } = await this.httpService.axiosRef.post<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User),
      userDTO
    );

    //await this.httpService.axiosRef.post(getAppURL(this.baseUrl.notify, AppRoute.User), userDTO);

    return data;
  }
}
