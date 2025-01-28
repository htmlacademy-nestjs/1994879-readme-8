import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginUserDTO, LoggedUserRDO } from '@project/authentication';
import { AvatarLimit } from '../app.const';
import { AxiosExceptionFilter } from '../filters/axios-exception.filter';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { getAppURL, TokenName } from '@project/helpers';
import { MongoIdValidationPipe } from '@project/pipes';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { ApiCustomResponse, UserId } from '@project/decorators';
import { UserService } from './user.service';
import { SwaggerResponse, SwaggerTag } from '@project/core';
import { ChangePasswordDTO, RegisterUserDTO } from '@project/blog-user';
import { UserRDO } from '@project/blog-user';

@Controller('users')
@ApiTags(SwaggerTag.User)
@UseFilters(AxiosExceptionFilter)
@ApiCustomResponse()
export class UsersController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(UserService) private userService: UserService,
    @Inject(gatewayConfig.KEY) private baseUrl: ConfigType<typeof gatewayConfig>
  ) {}

  private getAuthorizationHeaders(req: Request) {
    return {
      headers: {
        Authorization: req.headers['authorization'],
      },
    };
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: SwaggerResponse.UserCreated })
  @ApiConflictResponse({ description: SwaggerResponse.UserExist })
  public async register(
    @Body() dto: RegisterUserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: AvatarLimit.MaxSize })
        .addFileTypeValidator({ fileType: AvatarLimit.AvailableTypes })
        .build({ fileIsRequired: false })
    )
    avatarFile?: Express.Multer.File
  ) {
    return this.userService.register(dto, avatarFile);
  }

  @Post('login')
  @ApiCreatedResponse({ description: SwaggerResponse.UserCreated })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  @ApiBody({ type: LoginUserDTO })
  public async login(@Body() loginUserDTO: LoginUserDTO) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      getAppURL(this.baseUrl.account),
      loginUserDTO
    );
    return { data };
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserRDO, description: SwaggerResponse.Updated })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async update(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDTO,
    @Req() req: Request
  ) {
    const { data } = await this.httpService.axiosRef.patch<UserRDO>(
      getAppURL(this.baseUrl.account, `${id}`),
      dto,
      this.getAuthorizationHeaders(req)
    );

    return this.userService.getUserDetails(data);
  }

  @Get(':id')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse({ type: UserRDO, description: SwaggerResponse.UserFound })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  public async show(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, `${id}`),
      this.getAuthorizationHeaders(req)
    );

    return this.userService.getUserDetails(data);
  }

  @Post('refresh')
  @ApiBearerAuth(TokenName.Refresh)
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      getAppURL(this.baseUrl.account, 'refresh'),
      null,
      this.getAuthorizationHeaders(req)
    );

    return data;
  }

  @Post('check')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiCreatedResponse({ type: LoggedUserRDO, description: SwaggerResponse.UserFound })
  public async checkToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      getAppURL(this.baseUrl.account, 'check'),
      null,
      this.getAuthorizationHeaders(req)
    );

    return data;
  }

  @Post('subscribe/:id')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  public async subscribe(@Param('id', MongoIdValidationPipe) id: string, @UserId() userId: string) {
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, `${userId}/subscribe/${id}`)
    );
    return data;
  }

  @Delete('unsubscribe/:id')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  public async unsubscribe(
    @Param('id', MongoIdValidationPipe) id: string,
    @UserId() userId: string
  ) {
    const { data } = await this.httpService.axiosRef.delete(
      getAppURL(this.baseUrl.account, `${userId}/unsubscribe/${id}`)
    );
    return data;
  }
}
