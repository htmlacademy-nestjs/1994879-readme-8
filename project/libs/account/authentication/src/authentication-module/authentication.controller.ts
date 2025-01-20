import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserRDO } from '../rdo/user.rdo';
import { LoggedUserRDO } from '../rdo/logged-user.rdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDescription } from './authentication.constant';
import { MongoIdValidationPipe } from '@project/pipes';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NotifyService } from '@project/account-notify';

@ApiTags('Authentication')
@Controller('auth')
@SerializeOptions({ type: UserRDO, excludeExtraneousValues: true })
export class AuthenticationController {
  constructor(
    @Inject(AuthenticationService) private readonly authService: AuthenticationService,
    @Inject(NotifyService) private readonly notifyService: NotifyService
  ) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, description: AuthResponseDescription.UserCreated })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: AuthResponseDescription.UserExist })
  public async create(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    const { email, name } = user;
    await this.notifyService.registerSubscriber({ email, name });

    return user;
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
    const user = await this.authService.verifyUser(dto);
    const userToken = await this.authService.createUserToken(user);
    return { ...user, ...userToken };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.UserFound })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    return this.authService.getUser(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.UserFound })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthResponseDescription.LoggedError,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  public async changePassword(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: ChangePasswordDto
  ) {
    return this.authService.changePassword(id, dto);
  }
}
