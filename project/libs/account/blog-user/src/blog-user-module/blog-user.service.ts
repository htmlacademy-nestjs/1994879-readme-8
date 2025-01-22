import { Inject, Injectable } from '@nestjs/common';
import { BlogUserRepository } from './blog-user.repository';
import { BlogUserEntity } from './blog-user.entity';

@Injectable()
export class BlogUserService {
  constructor(@Inject(BlogUserRepository) private blogUserRepository: BlogUserRepository) {}

  public async save(userEntity: BlogUserEntity): Promise<void> {
    return this.blogUserRepository.save(userEntity);
  }

  public async update(userEntity: BlogUserEntity): Promise<void> {
    return this.blogUserRepository.update(userEntity);
  }

  public async findById(id: string): Promise<BlogUserEntity | null> {
    return this.blogUserRepository.findById(id);
  }

  public async findByEmail(email: string): Promise<BlogUserEntity | null> {
    return this.blogUserRepository.findByEmail(email);
  }
}
