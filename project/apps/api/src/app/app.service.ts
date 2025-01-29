import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NotifyService } from '@project/api-notify';
import { UserRDO } from '@project/blog-user';
import { UploadedFileRDO } from '@project/file-uploader';
import { NotifyNewPostDTO } from '@project/email-subscriber';
import FormData from 'form-data';
import 'multer';
import { PostRDO } from 'libs/blog/blog-post/src/post/rdo/post.rdo';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { getAppURL } from '@project/helpers';
import { AppRoute } from '@project/core';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(NotifyService) private notifyService: NotifyService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const { data } = await this.httpService.axiosRef.post<UploadedFileRDO>(
      getAppURL(this.baseUrl.file, AppRoute.File, AppRoute.Upload),
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return getAppURL(this.baseUrl.file, AppRoute.Static, data.subDirectory, data.hashName);
  }

  public async notifyNewUser({ email, name }: UserRDO): Promise<boolean> {
    return this.notifyService.registerSubscriber({ email, name });
  }

  public async notifyNewPost(dto: NotifyNewPostDTO): Promise<boolean> {
    return this.notifyService.notifyNewPost(dto);
  }

  public async appendUserInfo(posts: PostRDO[]) {
    const result = await Promise.allSettled(
      posts.map((post) =>
        this.httpService.axiosRef.get(
          getAppURL(this.baseUrl.account, `${AppRoute.User}/${post.userId}`)
        )
      )
    );
    result.filter((r) => r.status === 'rejected').forEach((i) => this.logger.error);
  }
}
