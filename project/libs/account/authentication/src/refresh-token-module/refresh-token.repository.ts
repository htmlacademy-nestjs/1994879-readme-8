import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenModel } from './refresh-token.model';
import { RefreshTokenFactory } from './refresh-token.factory';
import { Nullable } from '@project/core';

@Injectable()
export class RefreshTokenRepository extends BaseMongoRepository<
  RefreshTokenEntity,
  RefreshTokenModel
> {
  constructor(
    @Inject(RefreshTokenFactory) entityFactory: RefreshTokenFactory,
    @InjectModel(RefreshTokenModel.name) blogUserModel: Model<RefreshTokenModel>
  ) {
    super(entityFactory, blogUserModel);
  }

  public async deleteByTokenId(tokenId: string) {
    return this.model.deleteOne({ tokenId }).exec();
  }

  public async findByTokenId(tokenId: string): Promise<Nullable<RefreshTokenEntity>> {
    const document = await this.model.findOne({ tokenId }).exec();
    return this.createEntityFromDocument(document);
  }

  public async deleteExpiredTokens(): Promise<Number> {
    const deleteResult = await this.model.deleteMany({ expiresIn: { $lt: new Date() } });
    return deleteResult.deletedCount;
  }
}
