import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { getAppURL, TokenName } from '@project/helpers';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '@project/api-config';
import { ApiCustomResponse } from '@project/decorators';
import { UserService } from './user.service';
import { AppRoute, SwaggerOperation, SwaggerResponse, SwaggerTag } from '@project/core';
import { ChangePasswordDTO, RegisterUserDTO, UserDetailedRDO } from '@project/blog-user';
import { UserRDO } from '@project/blog-user';
import { SubscribeDTO } from '@project/blog-user';

@Controller(AppRoute.User)
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

  @Post(AppRoute.Register)
  @ApiOperation({ summary: SwaggerOperation.Register })
  @UseInterceptors(FileInterceptor('avatarFile'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: UserDetailedRDO, description: SwaggerResponse.UserCreated })
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

  @Post(AppRoute.Login)
  @ApiOperation({ summary: SwaggerOperation.Login })
  @ApiCreatedResponse({ description: SwaggerResponse.UserCreated })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  @ApiBody({ type: LoginUserDTO })
  public async login(@Body() loginUserDTO: LoginUserDTO) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.Auth),
      loginUserDTO
    );
    return { data };
  }

  @Patch(':id')
  @ApiOperation({ summary: SwaggerOperation.ChangePassword })
  @ApiOkResponse({ type: UserDetailedRDO, description: SwaggerResponse.Updated })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async update(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDTO,
    @Req() req: Request
  ) {
    const { data } = await this.httpService.axiosRef.patch<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, id),
      dto,
      this.getAuthorizationHeaders(req)
    );

    return this.userService.getUserDetails(data);
  }

  @Get(':id')
  @ApiOperation({ summary: SwaggerOperation.GetUser })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse({ type: UserDetailedRDO, description: SwaggerResponse.UserFound })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  public async show(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get<UserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.User, id),
      this.getAuthorizationHeaders(req)
    );

    return this.userService.getUserDetails(data);
  }

  @Post(AppRoute.Refresh)
  @ApiOperation({ summary: SwaggerOperation.RefreshToken })
  @ApiBearerAuth(TokenName.Refresh)
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.Auth, AppRoute.Refresh),
      null,
      this.getAuthorizationHeaders(req)
    );

    return data;
  }

  @Post(AppRoute.Check)
  @ApiOperation({ summary: SwaggerOperation.CheckAuth })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiCreatedResponse({ type: LoggedUserRDO, description: SwaggerResponse.UserFound })
  public async checkToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      getAppURL(this.baseUrl.account, AppRoute.Check),
      null,
      this.getAuthorizationHeaders(req)
    );

    return data;
  }

  @Post(AppRoute.Subscribe)
  @ApiOperation({ summary: SwaggerOperation.Subscribe })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  public async subscribe(@Body() dto: SubscribeDTO, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, AppRoute.User, AppRoute.Subscribe),
      dto,
      this.getAuthorizationHeaders(req)
    );
    return data;
  }

  @Post(AppRoute.Unsubscribe)
  @ApiOperation({ summary: SwaggerOperation.Unsubscribe })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unsubscribe(@Body() dto: SubscribeDTO, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      getAppURL(this.baseUrl.account, AppRoute.User, AppRoute.Unsubscribe),
      dto,
      this.getAuthorizationHeaders(req)
    );
    return data;
  }
}
