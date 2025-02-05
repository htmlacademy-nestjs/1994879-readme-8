import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LikeEntity } from './like.entity';
import { LikeRepository } from './like.repository';
import { LIKE_MESSAGE } from './like.constant';
import { LikeFactory } from './like.factory';
import { PostService } from '@project/blog-post';
import { PostStatus } from '@project/core';

@Injectable()
export class LikeService {
  constructor(
    @Inject(LikeRepository) private readonly likeRepository: LikeRepository,
    @Inject(LikeFactory) private readonly likeFactory: LikeFactory,
    @Inject(PostService) private readonly postService: PostService
  ) {}

  private async getLike(postId: string, userId: string): Promise<LikeEntity> {
    const post = await this.postService.getById(postId);
    if (post.status === PostStatus.Draft) {
      throw new ConflictException(LIKE_MESSAGE.DRAFT);
    }

    return this.likeRepository.find(postId, userId);
  }

  public async like(postId: string, userId: string): Promise<void> {
    const like = await this.getLike(postId, userId);
    if (like) {
      throw new ConflictException(LIKE_MESSAGE.EXISTS);
    }

    const newLike = this.likeFactory.createFromDTO({ postId, userId });
    this.likeRepository.save(newLike);
  }

  public async unlike(postId: string, userId: string): Promise<void> {
    const like = await this.getLike(postId, userId);
    if (!like) {
      throw new NotFoundException(LIKE_MESSAGE.NOT_FOUND);
    }

    this.likeRepository.deleteEntity(like);
  }

  public async getLikesCount(postId: string): Promise<number> {
    return this.likeRepository.countByPost(postId);
  }
}
