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
import {
  RegisterUserDto,
  LoginUserDto,
  UserRDO,
  CreateUserDto,
  LoggedUserRDO,
  AuthResponseDescription,
  ChangePasswordDto,
} from '@project/authentication';
import { ApiUnit, ApplicationServiceURL, AvatarLimit } from '../app.config';
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
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DEFAULT_AVATAR } from '@project/file-uploader';
import { plainToInstance } from 'class-transformer';
import { AppService } from '../app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { TokenName } from '@project/helpers';
import { MongoIdValidationPipe } from '@project/pipes';
import { InjectUserIdInterceptor } from '@project/interceptors';

const DEFAULT_AVATAR_PATH = `${ApplicationServiceURL.File}${DEFAULT_AVATAR}`;

@Controller('users')
@ApiTags(ApiUnit.User)
@UseFilters(AxiosExceptionFilter)
export class UsersController {
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

  @Post('register')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: AuthResponseDescription.UserCreated })
  @ApiConflictResponse({ description: AuthResponseDescription.UserExist })
  @ApiBadRequestResponse()
  public async register(
    @Body() dto: RegisterUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: AvatarLimit.MaxSize })
        .addFileTypeValidator({ fileType: AvatarLimit.AvailableTypes })
        .build({ fileIsRequired: false })
    )
    avatarFile?: Express.Multer.File
  ) {
    const userDto = plainToInstance(CreateUserDto, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
      avatar: avatarFile ? await this.appService.uploadFile(avatarFile) : DEFAULT_AVATAR_PATH,
    });

    const { data } = await this.httpService.axiosRef.post<UserRDO>(
      `${ApplicationServiceURL.Users}/register`,
      userDto
    );

    this.appService.notifyNewUser(data);
    return data;
  }

  @Post('login')
  @ApiCreatedResponse({ description: AuthResponseDescription.UserCreated })
  @ApiNotFoundResponse({ description: AuthResponseDescription.UserNotFound })
  @ApiBadRequestResponse()
  @ApiBody({ type: LoginUserDto })
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      ApplicationServiceURL.Users,
      loginUserDto
    );
    return { data };
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserRDO, description: AuthResponseDescription.Updated })
  @ApiNotFoundResponse({ description: AuthResponseDescription.UserNotFound })
  @ApiUnauthorizedResponse()
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async update(@Body() dto: ChangePasswordDto, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.patch<UserRDO>(
      `${ApplicationServiceURL.Users}`,
      dto,
      this.getAuthorizationHeaders(req)
    );

    return this.appService.getUserDetails(data);
  }

  @Get(':id')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse({ type: UserRDO, description: AuthResponseDescription.UserFound })
  @ApiNotFoundResponse({ description: AuthResponseDescription.UserNotFound })
  @ApiUnauthorizedResponse()
  public async show(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get<UserRDO>(
      `${ApplicationServiceURL.Users}/${id}`,
      this.getAuthorizationHeaders(req)
    );

    return this.appService.getUserDetails(data);
  }

  @Post('refresh')
  @ApiUnauthorizedResponse()
  @ApiBearerAuth(TokenName.Refresh)
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      `${ApplicationServiceURL.Users}/refresh`,
      null,
      this.getAuthorizationHeaders(req)
    );

    return data;
  }

  @Post('check')
  @UseGuards(CheckAuthGuard)
  @ApiUnauthorizedResponse()
  @ApiBearerAuth(TokenName.Access)
  @ApiCreatedResponse({ type: LoggedUserRDO, description: AuthResponseDescription.UserFound })
  public async checkToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      `${ApplicationServiceURL.Users}/check`,
      null,
      this.getAuthorizationHeaders(req)
    );

    return data;
  }

  @Post('subscribe/:id')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  public async subscribe(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body('userId') userId: string
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/${userId}/subscribe/${id}`
    );
    return data;
  }

  @Delete('unsubscribe/:id')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @ApiBearerAuth(TokenName.Access)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  public async unsubscribe(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body('userId') userId: string
  ) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Users}/${userId}/unsubscribe/${id}`
    );
    return data;
  }
}
