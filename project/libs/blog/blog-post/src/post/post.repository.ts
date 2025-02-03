import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PostEntity } from './entities/post.entity';
import { Prisma } from '@prisma/client';
import { PostFactory } from './post.factory';
import { PrismaClientService } from '@project/models';
import { CommonPost, PaginationResult, PostStatus, PostType, SortType } from '@project/core';
import { PostQuery } from './queries/post.query';
import { calculateSkipItems, createPaginationResponse } from '@project/helpers';
import { PostMessage, QueryDefaults } from './post.constant';

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, CommonPost> {
  constructor(entityFactory: PostFactory, readonly client: PrismaClientService) {
    super(entityFactory, client);
  }

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  public async findById(id: string): Promise<PostEntity> {
    const document = await this.client.post.findUnique({
      where: { id },
      include: { _count: { select: { comments: true, likes: true } } },
    });

    if (!document) {
      throw new NotFoundException(PostMessage.NotFound);
    }

    return this.createEntityFromDocument({
      ...document,
      type: document.type as PostType,
      status: document.status as PostStatus,
      commentsCount: document._count.comments,
      likesCount: document._count.likes,
    });
  }

  private buildWhereClause(query: PostQuery): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {};

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
      where.tags = Array.isArray(query.tags) ? { hasSome: query.tags } : { hasSome: [query.tags] };
    }

    if (query.title) {
      where.title = { contains: query.title, mode: 'insensitive' };
    }

    return where;
  }

  private buildOrderByClause(query: PostQuery): Prisma.PostOrderByWithRelationInput {
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    const sortDirection = query.sortDirection || QueryDefaults.SortDirection;
    const sortType = query.sortType || QueryDefaults.SortType;

    switch (sortType) {
      case SortType.Comments:
        orderBy.comments = { _count: sortDirection };
        break;
      case SortType.Likes:
        orderBy.likes = { _count: sortDirection };
        break;
      case SortType.PublicationDate:
        orderBy.publicationDate = sortDirection;
        break;
      case SortType.CreatedAt:
        orderBy.createdAt = sortDirection;
        break;
      default:
        orderBy.createdAt = sortDirection;
        break;
    }

    return orderBy;
  }

  public async findAll(query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    const { page = QueryDefaults.Page, limit: take = QueryDefaults.Limit } = query;
    const skip = calculateSkipItems(page, take);
    const where: Prisma.PostWhereInput = this.buildWhereClause(query);
    const orderBy: Prisma.PostOrderByWithRelationInput = this.buildOrderByClause(query);
    console.log(where, orderBy);

    const [documents, postCount] = await Promise.all([
      this.client.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { _count: { select: { comments: true, likes: true } } },
      }),
      this.getPostCount(where),
    ]);
    const entities = documents.map((document) =>
      this.createEntityFromDocument({
        ...document,
        type: document.type as PostType,
        status: document.status as PostStatus,
        commentsCount: document._count.comments,
        likesCount: document._count.likes,
      })
    );

    return createPaginationResponse(entities, postCount, take, page);
  }

  public async save(entity: PostEntity): Promise<void> {
    const postData = entity.toPOJO();
    const original = postData.originalId ? { connect: { id: postData.originalId } } : undefined;

    const record = await this.client.post.create({
      data: {
        ...postData,
        originalId: postData.originalId,
      },
    });
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
