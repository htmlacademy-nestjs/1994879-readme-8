import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UploadedFileRDO } from '@project/file-uploader';
import FormData from 'form-data';
import 'multer';
import { PostRDO } from 'libs/blog/blog-post/src/post/rdo/post.rdo';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { getAppURL } from '@project/helpers';
import { AppRoute } from '@project/core';
import { FILE_REQUIRED } from './app.const';

@Injectable()
export class AppService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException(FILE_REQUIRED);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const { data } = await this.httpService.axiosRef.post<UploadedFileRDO>(
      getAppURL(this.baseUrl.file, AppRoute.File, AppRoute.Upload),
      formData,
      { headers: formData.getHeaders() }
    );
    return getAppURL(this.baseUrl.file, AppRoute.Static, data.subDirectory, data.hashName);
  }
}
