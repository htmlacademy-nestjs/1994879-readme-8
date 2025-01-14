import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PostEntity } from './entities/post.entity';
import { Post as PostModel, Prisma } from '@prisma/client';
import { PostFactory } from './post.factory';
import { PrismaClientService } from '@project/models';
import { PaginationResult } from '@project/core';
import { PostQuery } from './post.query';

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, PostModel> {
  constructor(entityFactory: PostFactory, readonly client: PrismaClientService) {
    super(entityFactory, client);
  }

  private includeFields = {
    tags: true,
    // comments: true,
    // favorites: true,
  };

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async findById(id: string): Promise<PostEntity> {
    const document = await this.client.post.findFirst({
      where: { id },
      include: this.includeFields,
    });

    if (!document) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public async findAll(query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    if (query?.sortDirection) {
      orderBy.createdAt = query.sortDirection;
    }

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({ where, orderBy, skip, take, include: this.includeFields }),
      this.getPostCount(where),
    ]);

    return {
      entities: records.map((record) => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculatePostsPage(postCount, take),
      itemsPerPage: take,
      totalItems: postCount,
    };
  }

  public async save(entity: PostEntity): Promise<void> {
    const { id, ...postData } = entity.toPOJO();

    const record = await this.client.post.create({
      data: {
        ...postData,
        tags: {
          connectOrCreate: (postData.tags ?? []).map(({ name }) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    entity.id = record.id;
  }

  public async update(entity: PostEntity): Promise<void> {
    const post = entity.toPOJO();
    const record = await this.client.post.update({
      where: { id: post.id },
      data: {
        ...post,
        tags: {
          connectOrCreate: (post.tags ?? []).map(({ name }) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } });
  }
}
