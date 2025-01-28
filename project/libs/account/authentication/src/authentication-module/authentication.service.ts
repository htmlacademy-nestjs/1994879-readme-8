import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogUserService, BlogUserEntity } from '@project/blog-user';
import { AuthMessage } from './authentication.constant';
import { LoginUserDTO } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@project/core';
import { jwtConfig } from '@project/account-config';
import { ConfigType } from '@nestjs/config';
import { createJWTPayload } from '@project/helpers';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(BlogUserService) private readonly blogUserService: BlogUserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) {}

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException(AuthMessage.JWTCreateError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async checkUserPassword(user: BlogUserEntity, password: string): Promise<void> {
    if (!(await user.comparePassword(password))) {
      throw new UnauthorizedException(AuthMessage.WrongPassword);
    }
  }

  private checkExistsUser(user: BlogUserEntity): BlogUserEntity {
    if (!user) {
      throw new NotFoundException(AuthMessage.NotFound);
    }
    return user;
  }

  public async getUser(id: string) {
    const user = await this.blogUserService.getById(id);
    return this.checkExistsUser(user);
  }

  public async verifyUser({ email, password }: LoginUserDTO) {
    const user = await this.blogUserService.findByEmail(email);

    this.checkExistsUser(user);
    await this.checkUserPassword(user, password);
    return user;
  }
}
