import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PostEntity } from './entities/post.entity';
import { Post as PostModel, Prisma } from '@prisma/client';
import { PostFactory } from './post.factory';
import { PrismaClientService } from '@project/models';
import { PaginationResult } from '@project/core';
import { PostQuery } from './queries/post.query';
import { calculateSkipItems, createPaginationResponse } from '@project/helpers';
import { PostMessage, QueryDefaults } from './post.constant';

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, PostModel> {
  constructor(entityFactory: PostFactory, readonly client: PrismaClientService) {
    super(entityFactory, client);
  }

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  public async findById(id: string): Promise<PostEntity> {
    const document = await this.client.post.findFirst({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(PostMessage.NotFound);
    }

    return this.createEntityFromDocument(document);
  }

  public async findAll(query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    const { page = QueryDefaults.Page, limit: take = QueryDefaults.Limit } = query;
    const skip = calculateSkipItems(page, take);
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query.userIds) {
      where.userId = Array.isArray(query.userIds)
        ? { in: query.userIds }
        : { equals: query.userIds };
    }

    if (query.postType) {
      where.type = query.postType;
    }

    if (query.postStatus) {
      where.status = query.postStatus;
    }

    if (query.tags) {
      where.tags = Array.isArray(query.tags)
        ? { hasSome: [...query.tags] }
        : { hasSome: [query.tags] };
    }

    if (query?.title) {
      where.title = { contains: query.title, mode: 'insensitive' };
    }

    const sortDirection = query.sortDirection || QueryDefaults.SortDirection;

    if (query.sortType || QueryDefaults.SortType) {
      // orderBy[query.sortType] = sortDirection;
      // orderBy.comments = { _count: sortDirection }
    }

    console.log(where, orderBy);

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({
        where,
        orderBy,
        skip,
        take,
        // select: { _count: { select: { comments: true, likes: true } } },
      }),
      this.getPostCount(where),
    ]);
    const entities = records.map((record) => this.createEntityFromDocument(record));

    return createPaginationResponse(entities, postCount, take, page);
  }

  public async save(entity: PostEntity): Promise<void> {
    const { id, ...data } = entity.toPOJO();
    const record = await this.client.post.create({ data });
    entity.id = record.id;
  }

  public async update(entity: PostEntity): Promise<void> {
    const post = entity.toPOJO();
    await this.client.post.update({
      where: { id: post.id },
      data: { ...post },
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } });
  }

  public async countUserPost(userId: string): Promise<number> {
    return this.getPostCount({ userId });
  }
}
