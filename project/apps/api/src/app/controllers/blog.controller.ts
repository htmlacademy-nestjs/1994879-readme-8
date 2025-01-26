import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { ApiUnit } from '../app.const';
import { AddNewPostDTO } from '../dto/add-new-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { UserRDO } from '@project/authentication';
import { PostWithPaginationRDO } from '@project/blog-post';
import { PostQuery } from '@project/blog-post';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { getAppURL } from '@project/helpers';

@Controller('blog')
@ApiTags(ApiUnit.Blog)
@UseGuards(CheckAuthGuard)
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(AppService) private appService: AppService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  private getAuthorizationHeaders(req: Request) {
    return {
      headers: {
        Authorization: req.headers['authorization'],
      },
    };
  }

  @Get()
  @UseInterceptors(UseInterceptors)
  public async index(@Query() queryParams: PostQuery) {
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRDO>(
      getAppURL(this.baseUrl.blog),
      { params: queryParams }
    );
    await this.appService.appendUserInfo(data.entities);
    return data;
  }

  @Post()
  @UseInterceptors(UseInterceptors)
  public async create(@Body() dto: AddNewPostDTO) {
    const { data } = await this.httpService.axiosRef.post<PostWithPaginationRDO>(
      getAppURL(this.baseUrl.blog),
      dto
    );
    await this.appService.appendUserInfo(data.entities);
    return data;
  }

  @Get('feed')
  @UseInterceptors(InjectUserIdInterceptor)
  public async getUserFeed(@Body('userId') userId: string, @Req() req: Request) {
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, `${userId}`),
      this.getAuthorizationHeaders(req)
    );

    const userIds = [user.id, ...user.subscriptions];
    const userPostsFeed = await this.index({ userIds });

    return userPostsFeed;
  }
}
