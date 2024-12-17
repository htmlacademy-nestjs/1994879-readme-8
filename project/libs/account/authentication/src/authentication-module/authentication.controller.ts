import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserRDO } from '../rdo/user.rdo';
import { LoggedUserRDO } from '../rdo/logged-user.rdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDescription } from './authentication.constant';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserRDO, excludeExtraneousValues: true })
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, description: AuthResponseDescription.UserCreated })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: AuthResponseDescription.UserExist })
  public async create(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: AuthResponseDescription.LoggedSuccess })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthResponseDescription.LoggedError,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  @SerializeOptions({ type: LoggedUserRDO, excludeExtraneousValues: true })
  public async login(@Body() dto: LoginUserDto) {
    return this.authService.verifyUser(dto);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.UserFound })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  public async show(@Param('id') id: string) {
    return this.authService.getUser(id);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.UserFound })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthResponseDescription.LoggedError,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  public async changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }
}
