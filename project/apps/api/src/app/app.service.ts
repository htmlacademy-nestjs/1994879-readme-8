import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NotifyService } from '@project/api-notify';
import { UserDetailedRDO, UserRDO } from '@project/authentication';
import { UploadedFileRdo } from '@project/file-uploader';
import { ApplicationServiceURL } from './app.config';
import { NotifyNewPostDto } from '@project/email-subscriber';
import FormData from 'form-data';
import 'multer';
import { PostRDO } from 'libs/blog/blog-post/src/post/rdo/post.rdo';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(NotifyService) private notifyService: NotifyService
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      return '';
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const { data } = await this.httpService.axiosRef.post<UploadedFileRdo>(
      `${ApplicationServiceURL.File}/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    return `${data.subDirectory}/${data.hashName}`;
  }

  public async notifyNewUser(dto: UserRDO): Promise<boolean> {
    const { email, name } = dto;
    return this.notifyService.registerSubscriber({ email, name });
  }

  public async notifyNewPost(dto: NotifyNewPostDto): Promise<boolean> {
    return this.notifyService.notifyNewPost(dto);
  }

  public async getUserDetails(user: UserRDO): Promise<UserDetailedRDO> {
    const { data: publicationsCount } = await this.httpService.axiosRef.get<number>(
      `${ApplicationServiceURL.Blog}/count/${user.id}`
    );
    return {
      ...user,
      publicationsCount,
      subscriptionsCount: user.subscriptions.length,
    };
  }

  public async appendUserInfo(posts: PostRDO[]) {
    await Promise.all(
      posts.map(async (post) => {
        try {
          post['user'] = await this.httpService.axiosRef.get<UserRDO>(
            `ApplicationServiceURL.Users/${post.userId}`
          );
        } catch (error) {
          this.logger.error(`Failed to get details fot user ${post.userId}:`, error);
        }
      })
    );
  }
}
