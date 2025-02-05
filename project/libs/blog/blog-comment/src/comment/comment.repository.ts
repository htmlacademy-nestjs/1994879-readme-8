import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, Nullable, PaginationQuery, PaginationResult } from '@project/core';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/data-access';
import { CommentEntity } from './entities/comment.entity';
import { CommentFactory } from './comment.factory';
import { MAX_COMMENTS_COUNT } from './comment.constant';
import { Prisma } from '@prisma/client';
import { calculateSkipItems, createPaginationResponse } from '@project/helpers';

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

  public async findByPostId(
    postId: string,
    pagination: PaginationQuery
  ): Promise<PaginationResult<CommentEntity>> {
    const { page = 1, limit: take = MAX_COMMENTS_COUNT } = pagination;
    const skip = calculateSkipItems(page, take);
    const where: Prisma.CommentWhereInput = { postId };

    const [count, documents] = await Promise.all([
      this.client.comment.count({ where }),
      this.client.comment.findMany({ skip, take, where }),
    ]);
    const entities = documents.map((document) => this.createEntityFromDocument(document));

    return createPaginationResponse(entities, count, take, pagination?.page);
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
