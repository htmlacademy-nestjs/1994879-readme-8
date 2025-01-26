import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserRDO } from '../rdo/user.rdo';
import { LoggedUserRDO } from '../rdo/logged-user.rdo';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDescription } from './authentication.constant';
import { MongoIdValidationPipe } from '@project/pipes';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestWithUser } from './request-with-user.interface';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { RequestWithTokenPayload } from './request-with-token-payload.interface';
import { LoginUserDTO } from '../dto/login-user.dto';

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth()
@SerializeOptions({ type: UserRDO, excludeExtraneousValues: true })
export class AuthenticationController {
  constructor(@Inject(AuthenticationService) private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, description: AuthResponseDescription.UserCreated })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: AuthResponseDescription.UserExist })
  public async create(@Body() dto: CreateUserDTO) {
    return this.authService.register(dto);
  }

  @Post()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: AuthResponseDescription.LoggedSuccess })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthResponseDescription.LoggedError,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  @ApiBody({ type: LoginUserDTO })
  @SerializeOptions({ type: LoggedUserRDO, excludeExtraneousValues: true })
  public async login(@Req() { user }: RequestWithUser) {
    return await this.authService.createUserToken(user);
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
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.Updated })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthResponseDescription.LoggedError,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: AuthResponseDescription.UserNotFound })
  public async changePassword(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: ChangePasswordDTO
  ) {
    return this.authService.changePassword(id, dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: AuthResponseDescription.RefreshToken })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
