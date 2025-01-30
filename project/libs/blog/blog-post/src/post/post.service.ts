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
import { PostQuery } from './post.query';
import { PaginationResult, PostStatus } from '@project/core';
import { PostMessage } from './post.constant';
import { LikeService } from '@project/blog-like';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
    @Inject(LikeService) private readonly likeService: LikeService
  ) {}

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

  async create(dto: CreatePostDTO): Promise<PostEntity> {
    const newPost = PostFactory.createFromPostDTO(dto);
    await this.postRepository.save(newPost);
    return newPost;
  }

  async findAll(query: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findAll(query);
  }

  async findOne(id: string): Promise<PostEntity> {
    return this.getById(id);
  }

  async update(id: string, userId: string, dto: UpdatePostDTO): Promise<PostEntity> {
    const existsPost = await this.getById(id);
    this.checkAccess(existsPost, userId);

    const updatePost = PostFactory.createFromPostDTO({ ...existsPost.toPOJO, ...dto });
    await this.postRepository.update(updatePost);

    return updatePost;
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.getById(id);
    this.checkAccess(post, userId);

    await this.postRepository.deleteById(id);
  }

  public getUserPostsCount(userId: string) {
    return this.postRepository.countUserPost(userId);
  }

  public async like(postId: string, userId: string): Promise<void> {
    const post = await this.getById(postId);
    if (post.status === PostStatus.Draft) {
      throw new ConflictException(PostMessage.LikeDraft);
    }
    return this.likeService.like({ postId, userId });
  }

  public async unlike(postId: string, userId: string): Promise<void> {
    return this.likeService.unlike({ postId, userId });
  }
}
