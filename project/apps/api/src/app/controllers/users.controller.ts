import { HttpService } from '@nestjs/axios';
import { Body, Controller, Inject, Post, Req, UseFilters } from '@nestjs/common';
import { LoginUserDto } from '@project/authentication';
import { ApiUnit, ApplicationServiceURL } from '../app.config';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import { NotifyService } from '@project/api-notify';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags(ApiUnit.User)
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(NotifyService) private notifyService: NotifyService
  ) {}

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      ApplicationServiceURL.Users,
      loginUserDto
    );
    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }
}
