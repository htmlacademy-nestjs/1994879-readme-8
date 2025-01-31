import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, Nullable } from '@project/core';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/data-access';
import { CommentEntity } from './entities/comment.entity';
import { CommentFactory } from './comment.factory';
import { MAX_COMMENTS_COUNT } from './comment.constant';

@Injectable()
export class CommentRepository extends BasePostgresRepository<CommentEntity, Comment> {
  constructor(entityFactory: CommentFactory, readonly client: PrismaClientService) {
    super(entityFactory, client);
  }

  public async save(entity: CommentEntity): Promise<void> {
    const { id, ...commentData } = entity.toPOJO();
    const record = await this.client.comment.create({
      data: commentData,
    });

    entity.id = record.id;
  }

  public async findAll(postId: string): Promise<CommentEntity[]> {
    const documents = await this.client.comment.findMany({
      where: { postId },
      take: MAX_COMMENTS_COUNT,
    });

    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async findById(id: string): Promise<Nullable<CommentEntity>> {
    const document = await this.client.comment.findFirst({
      where: { id },
    });

    if (!document) {
      return null;
    }

    return this.createEntityFromDocument(document);
  }

  public async delete(id: string): Promise<void> {
    await this.client.comment.delete({ where: { id } });
  }
}
