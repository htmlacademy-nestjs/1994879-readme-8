import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { UserRDO, RegisterUserDTO, UserDetailedRDO } from '@project/blog-user';
import { getAppURL } from '@project/helpers';
import { AppService } from '../app.service';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO } from '@project/blog-user';

@Injectable()
export class UserService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>,
    private readonly appService: AppService
  ) {}

  private getDefaultAvatar(): string {
    return getAppURL(this.baseUrl.file, '/static/avatar.jpg');
  }

  public async getUserDetails(user: UserRDO): Promise<UserDetailedRDO> {
    const { data: publicationsCount } = await this.httpService.axiosRef.get<number>(
      getAppURL(this.baseUrl.blog, `count/${user.id}`)
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
      getAppURL(this.baseUrl.account, 'register'),
      userDTO
    );

    this.appService.notifyNewUser(data);
    return data;
  }
}
