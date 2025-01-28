import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoggedUserRDO } from '../rdo/logged-user.rdo';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerOperation, SwaggerResponse } from '@project/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestWithUser } from './request-with-user.interface';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { RequestWithTokenPayload } from './request-with-token-payload.interface';
import { LoginUserDTO } from '../dto/login-user.dto';
import { SwaggerTag } from '@project/core';
import { ApiCustomResponse } from '@project/decorators';
import { TokenName } from '@project/helpers';

@ApiTags(SwaggerTag.Auth)
@Controller('auth')
@ApiBearerAuth(TokenName.Access)
@ApiCustomResponse()
export class AuthenticationController {
  constructor(@Inject(AuthenticationService) private readonly authService: AuthenticationService) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.Login })
  @ApiCreatedResponse({ description: SwaggerResponse.LoggedSuccess })
  @ApiNotFoundResponse({ description: SwaggerResponse.UserNotFound })
  @ApiBody({ type: LoginUserDTO })
  @SerializeOptions({ type: LoggedUserRDO, excludeExtraneousValues: true })
  public async login(@Req() { user }: RequestWithUser) {
    return await this.authService.createUserToken(user);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: SwaggerOperation.RefreshToken })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerResponse.RefreshToken })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: SwaggerOperation.CheckAuth })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
