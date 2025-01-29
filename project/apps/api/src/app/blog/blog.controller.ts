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
import { AddNewPostDTO } from '../dto/add-new-post.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { UserRDO } from '@project/blog-user';
import { PostWithPaginationRDO } from '@project/blog-post';
import { PostQuery } from '@project/blog-post';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { getAppURL, TokenName } from '@project/helpers';
import { ApiCustomResponse, UserId } from '@project/decorators';
import { AppRoute, SwaggerOperation, SwaggerResponse, SwaggerTag } from '@project/core';

@Controller(AppRoute.Blog)
@ApiTags(SwaggerTag.Blog)
@UseGuards(CheckAuthGuard)
@UseFilters(AxiosExceptionFilter)
@ApiCustomResponse()
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
  @ApiOperation({ summary: SwaggerOperation.Login })
  public async index(@Query() queryParams: PostQuery) {
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRDO>(
      getAppURL(this.baseUrl.blog, AppRoute.Post),
      { params: queryParams }
    );
    await this.appService.appendUserInfo(data.entities);
    return data;
  }

  @Post()
  public async create(@Body() dto: AddNewPostDTO) {
    const { data } = await this.httpService.axiosRef.post<PostWithPaginationRDO>(
      getAppURL(this.baseUrl.blog),
      dto
    );
    await this.appService.appendUserInfo(data.entities);
    return data;
  }

  @Get(AppRoute.Feed)
  @ApiOperation({ summary: SwaggerOperation.Feed })
  @ApiOkResponse({ description: SwaggerResponse.Feed })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async getUserFeed(@UserId() userId: string, @Req() req: Request) {
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, `${userId}`),
      this.getAuthorizationHeaders(req)
    );

    const userIds = [user.id, ...user.subscribers];
    console.log(333, userIds);
    const userPostsFeed = await this.index({ userIds });

    return userPostsFeed;
  }
}
