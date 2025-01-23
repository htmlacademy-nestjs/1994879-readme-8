import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NotifyService } from '@project/api-notify';
import { UserRDO } from '@project/authentication';
import { UploadedFileRdo } from '@project/file-uploader';
import { ApplicationServiceURL } from './app.config';
import { NotifyNewPostDto } from '@project/email-subscriber';
import FormData from 'form-data';
import 'multer';

@Injectable()
export class AppService {
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
}
