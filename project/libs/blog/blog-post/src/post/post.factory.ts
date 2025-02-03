import { Injectable } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
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

  public static createFromPostDTO(dto: CreatePostDTO): PostEntity {
    const post: CommonPost = {
      type: dto.type,
      status: dto.status,
      publicationDate: dto.publicationDate,
      tags: dto.tags,
      userId: dto.userId,
      originalId: null,
      originalUserId: null,
      isRepost: false,
      commentsCount: 0,
      likesCount: 0,
      title: null,
      description: null,
      text: null,
      author: null,
      url: null,
    };

    if (dto instanceof VideoPostDTO) {
      const { title, url } = dto as VideoPostDTO;
      post.title = title;
      post.url = url;
    } else if (dto instanceof TextPostDTO) {
      const { title, description, text } = dto as TextPostDTO;
      post.title = title;
      post.description = description;
      post.text = text;
    } else if (dto instanceof PhotoPostDTO) {
      const { url } = dto as PhotoPostDTO;
      post.url = url;
    } else if (dto instanceof LinkPostDTO) {
      const { url, description } = dto as LinkPostDTO;
      post.url = url;
      post.description = description;
    } else if (dto instanceof QuotePostDTO) {
      const { author, text } = dto as QuotePostDTO;
      post.author = author;
      post.text = text;
    }

    return new PostEntity(post);
  }
}
