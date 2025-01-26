import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@project/account-config';
import { RefreshTokenPayload } from '@project/core';
import { AuthenticationService } from '../authentication-module/authentication.service';
import { StrategyName } from '../constant';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';
import { TokenNotExistsException } from '../exceptions/token-not-exists.exception';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyName.JwtRefresh) {
  constructor(
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    @Inject(AuthenticationService) private readonly authService: AuthenticationService,
    @Inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.refreshTokenSecret,
    });
  }

  public async validate(payload: RefreshTokenPayload) {
    if (!(await this.refreshTokenService.isExists(payload.tokenId))) {
      throw new TokenNotExistsException(payload.tokenId);
    }

    await this.refreshTokenService.deleteRefreshSession(payload.tokenId);
    return this.authService.getUser(payload.sub);
  }
}
