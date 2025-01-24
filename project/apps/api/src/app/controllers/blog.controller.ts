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
import { ApiUnit, ApplicationServiceURL } from '../app.config';
import { AddNewPostDto } from '../dto/add-new-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { InjectUserIdInterceptor } from '@project/interceptors';
import { UserRDO } from '@project/authentication';
import { PostWithPaginationRdo } from '@project/blog-post';
import { PostQuery } from '@project/blog-post';

@Controller('blog')
@ApiTags(ApiUnit.Blog)
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(AppService) private appService: AppService
  ) {}

  private getAuthorizationHeaders(req: Request) {
    return {
      headers: {
        Authorization: req.headers['authorization'],
      },
    };
  }

  @Get()
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseInterceptors)
  public async index(@Query() queryParams: PostQuery) {
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRdo>(
      ApplicationServiceURL.Blog,
      { params: queryParams }
    );
    await this.appService.appendUserInfo(data.entities);
    return data;
  }

  @Post()
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseInterceptors)
  public async create(@Body() dto: AddNewPostDto) {
    const { data } = await this.httpService.axiosRef.post<PostWithPaginationRdo>(
      ApplicationServiceURL.Blog,
      dto
    );
    await this.appService.appendUserInfo(data.entities);
    return data;
  }

  @Get('feed')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async getUserFeed(@Body('userId') userId: string, @Req() req: Request) {
    const { data: user } = await this.httpService.axiosRef.get<UserRDO>(
      `${ApplicationServiceURL.Users}/${userId}`,
      this.getAuthorizationHeaders(req)
    );

    const userIds = [user.id, ...user.subscriptions];
    const userPostsFeed = await this.index({ userIds });

    return userPostsFeed;
  }
}
