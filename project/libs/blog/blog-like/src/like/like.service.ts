import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LikeEntity } from './like.entity';
import { LikeRepository } from './like.repository';
import { LIKE_MESSAGE } from './like.constant';
import { LikeDTO } from './dto/like.dto';
import { LikeFactory } from './like.factory';

@Injectable()
export class LikeService {
  constructor(
    @Inject(LikeRepository) private readonly likeRepository: LikeRepository,
    @Inject(LikeFactory) private readonly likeFactory: LikeFactory
  ) {}

  private async getLike(dto: LikeDTO): Promise<LikeEntity> {
    return this.likeRepository.find(dto);
  }

  public async like(dto: LikeDTO): Promise<void> {
    const existLike = await this.getLike(dto);

    if (existLike) {
      throw new ConflictException(LIKE_MESSAGE.EXISTS);
    }

    const newLike = this.likeFactory.createFromDTO(dto);
    this.likeRepository.save(newLike);
  }

  public async unlike(dto: LikeDTO): Promise<void> {
    const existLike = await this.getLike(dto);
    if (!existLike) {
      throw new NotFoundException(LIKE_MESSAGE.NOT_FOUND);
    }

    this.likeRepository.deleteEntity(existLike);
  }

  public async getLikesCount(postId: string): Promise<number> {
    return this.likeRepository.countByPost(postId);
  }
}
