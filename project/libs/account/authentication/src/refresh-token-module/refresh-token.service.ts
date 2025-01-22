import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@project/account-config';
import { RefreshTokenPayload } from '@project/core';
import { getExpiresIn, parseTime } from '@project/helpers';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshTokenEntity } from './refresh-token.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name, { timestamp: true });

  constructor(
    @Inject(RefreshTokenRepository) private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) {}

  public async createRefreshSession(payload: RefreshTokenPayload) {
    const refreshToken = new RefreshTokenEntity({
      tokenId: payload.tokenId,
      createdAt: new Date(),
      userId: payload.sub,
      expiresIn: getExpiresIn(this.jwtOptions.refreshTokenExpiresIn),
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  public async deleteRefreshSession(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByTokenId(tokenId);
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findByTokenId(tokenId);
    return refreshToken !== null;
  }

  @Cron('0 0 * * * *')
  public async deleteExpiredRefreshTokens() {
    const count = await this.refreshTokenRepository.deleteExpiredTokens();
    this.logger.log(`Delete expired refresh tokens. (${count})`);
  }
}
