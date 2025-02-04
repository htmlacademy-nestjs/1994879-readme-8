import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { PostEntity } from './entities/post.entity';
import { PostFactory } from './post.factory';
import { PostQuery } from './queries/post.query';
import { PaginationResult } from '@project/core';
import { PostMessage } from './post.constant';

@Injectable()
export class PostService {
  constructor(@Inject(PostRepository) private readonly postRepository: PostRepository) {}

  private checkAccess(post: PostEntity, userId: string) {
    if (post.userId !== userId) {
      throw new ForbiddenException(PostMessage.AccessDeny);
    }
  }

  public async getById(id: string): Promise<PostEntity> {
    const post = this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(PostMessage.NotFound);
    }
    return post;
  }

  public async create(userId: string, dto: CreatePostDTO): Promise<PostEntity> {
    const newPost = PostFactory.createFromPostDTO(dto, userId);
    await this.postRepository.save(newPost);
    return newPost;
  }

  public async findAll(query: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findAll(query);
  }

  public async update(id: string, userId: string, dto: UpdatePostDTO): Promise<PostEntity> {
    const existsPost = await this.getById(id);
    this.checkAccess(existsPost, userId);

    const updatePost = Object.assign(existsPost, dto, { userId, id });
    await this.postRepository.update(updatePost);

    return updatePost;
  }

  public async remove(id: string, userId: string): Promise<void> {
    const post = await this.getById(id);
    this.checkAccess(post, userId);

    await this.postRepository.deleteById(id);
  }

  public async createRepost(postId: string, userId: string): Promise<PostEntity> {
    const post = await this.getById(postId);
    if (post.userId === userId) {
      throw new ConflictException(PostMessage.RepostSelf);
    }

    const { entities } = await this.postRepository.findAll({ userIds: userId });
    const repostExists = entities.some((entity) => entity.isRepost && entity.originalId === postId);
    if (repostExists) {
      throw new ConflictException(PostMessage.RepostExists);
    }

    const newRepost = PostFactory.createRepost(post, userId);
    await this.postRepository.save(newRepost);
    return newRepost;
  }

  public async getUserPostsCount(userId: string): Promise<number> {
    return this.postRepository.countUserPost(userId);
  }
}
