import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PostEntity } from './entities/post.entity';
import { Post as PostModel } from '@prisma/client';
import { PostFactory } from './post.factory';
import { PrismaClientService } from '@project/models';

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, PostModel> {
  constructor(entityFactory: PostFactory, readonly client: PrismaClientService) {
    super(entityFactory, client);
  }

  private includeFields = {
    tags: true,
    comments: true,
    favorites: true,
  };

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

  public async findAll(): Promise<PostEntity[]> {
    const documents = await this.client.post.findMany({
      include: this.includeFields,
    });

    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async save(entity: PostEntity): Promise<void> {
    const post = entity.toPOJO();

    const record = await this.client.post.create({
      data: {
        ...post,
        id: undefined,
        tags: {
          connectOrCreate: (post.tags ?? []).map(({ name }) => ({
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
