import { Inject, Injectable } from '@nestjs/common';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/data-access';
import { Like, Nullable } from '@project/core';
import { LikeEntity } from './like.entity';
import { LikeFactory } from './like.factory';

@Injectable()
export class LikeRepository extends BasePostgresRepository<LikeEntity, Like> {
  constructor(likeFactory: LikeFactory, readonly client: PrismaClientService) {
    super(likeFactory, client);
  }
  public async find(postId: string, userId: string): Promise<Nullable<LikeEntity>> {
    const document = await this.client.like.findFirst({
      where: { userId, postId },
    });
    return this.createEntityFromDocument(document);
  }

  public override async save(entity: LikeEntity): Promise<void> {
    await this.client.like.create({
      data: { ...entity.toPOJO() },
    });
  }

  public async deleteEntity({ postId, userId }: LikeEntity): Promise<void> {
    await this.client.like.delete({
      where: {
        userId_postId: { postId, userId },
      },
    });
  }

  public async countByPost(postId: string): Promise<number> {
    return this.client.like.count({ where: { postId } });
  }
}
