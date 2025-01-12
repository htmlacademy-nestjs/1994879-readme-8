import { Injectable } from '@nestjs/common';
import { EntityFactory, Post } from '@project/core';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { plainToClass } from 'class-transformer';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostFactory implements EntityFactory<PostEntity> {
  public create(entityPlainData: Post): PostEntity {
    return new PostEntity(entityPlainData);
  }

  public static createFromPostDto(dto: CreatePostDto | UpdatePostDto): PostEntity {
    const entity = plainToClass(PostEntity, dto);
    entity.tags = (dto.tags ?? []).map((name) => ({ name }));
    return entity;
  }
}
