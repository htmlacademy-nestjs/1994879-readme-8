import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';
import {
  CreatePostDTO,
  LinkPostDTO,
  PhotoPostDTO,
  QuotePostDTO,
  TextPostDTO,
  VideoPostDTO,
} from './dto/create-post.dto';
import { CommonPost, EntityFactory } from '@project/core';

@Injectable()
export class PostFactory implements EntityFactory<PostEntity> {
  public create(entityPlainData: CommonPost): PostEntity {
    return new PostEntity(entityPlainData);
  }

  public static createFromPostDTO(dto: CreatePostDTO, userId: string): PostEntity {
    const entity = new PostEntity({ ...dto, userId, isRepost: false, status: dto.status });

    return entity;
  }

  public static createRepost(post: PostEntity, userId: string): PostEntity {
    post.originalUserId = post.userId;
    post.originalId = post.id;
    post.isRepost = true;
    post.publicationDate = new Date();
    post.userId = userId;
    delete post.createdAt;
    delete post.updatedAt;
    delete post.commentsCount;
    delete post.likesCount;
    post.id = undefined;

    return post;
  }
}
