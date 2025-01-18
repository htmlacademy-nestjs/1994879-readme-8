import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { plainToClass } from 'class-transformer';
import { PostEntity } from './entities/post.entity';
import { PostFactory } from './post.factory';
import { PostQuery } from './post.query';
import { PaginationResult } from '@project/core';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(dto: CreatePostDto): Promise<PostEntity> {
    const newPost = PostFactory.createFromPostDto(dto);
    await this.postRepository.save(newPost);
    return newPost;
  }

  async findAll(query: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findAll(query);
  }

  async findOne(id: string): Promise<PostEntity | null> {
    return this.postRepository.findById(id);
  }

  async update(id: string, dto: UpdatePostDto): Promise<PostEntity> {
    const existsPost = await this.postRepository.findById(id);
    const updatePost = PostFactory.createFromPostDto(dto);
    let hasChanges = false;

    for (const [key, value] of Object.entries(updatePost)) {
      if (value !== undefined && existsPost[key] !== value) {
        existsPost[key] = value;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return existsPost;
    }

    await this.postRepository.update(existsPost);

    return existsPost;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.postRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
