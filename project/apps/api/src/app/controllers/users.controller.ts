import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DEFAULT_AVATAR } from '@project/file-uploader';
import { plainToInstance } from 'class-transformer';
import { AppService } from '../app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from '../guards/check-auth.guard';
import { TokenName } from '@project/helpers';

const DEFAULT_AVATAR_PATH = `${ApplicationServiceURL.File}${DEFAULT_AVATAR}`;

@Controller('users')
@ApiTags(ApiUnit.User)
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(AppService) private appService: AppService
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, description: AuthResponseDescription.UserCreated })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: AuthResponseDescription.UserExist })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
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

  @ApiBody({ type: LoginUserDto })
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post<LoggedUserRDO>(
      ApplicationServiceURL.Users,
      loginUserDto
    );
    const { accessToken, refreshToken } = data;
    return { accessToken, refreshToken };
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.Updated })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  public async update(@Body() dto: ChangePasswordDto, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.patch<UserRDO>(
      `${ApplicationServiceURL.Users}`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @Get(':id')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiResponse({
    type: UserRDO,
    status: HttpStatus.OK,
    description: AuthResponseDescription.UserFound,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  public async show(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.get(`${ApplicationServiceURL.Users}/${id}`, {
      headers: {
        Authorization: req.headers['authorization'],
      },
    });

    return data;
  }

  @Post('refresh')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Refresh)
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

  @Post('check')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth(TokenName.Access)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthResponseDescription.UserFound,
  })
  public async checkToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/check`,
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
