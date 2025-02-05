import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogUserRepository } from './blog-user.repository';
import { BlogUserEntity } from './blog-user.entity';
import { Nullable } from '@project/core';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserMessage } from './blog-user.constant';
import { BlogUserFactory } from './blog-user.factory';
import { ChangePasswordDTO } from '@project/blog-user';
import { UserQuery } from './blog-user.query';

@Injectable()
export class BlogUserService {
  constructor(@Inject(BlogUserRepository) private blogUserRepository: BlogUserRepository) {}

  public async create(dto: CreateUserDTO): Promise<BlogUserEntity> {
    const existUser = await this.blogUserRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException(UserMessage.Exists);
    }

    const entity = await new BlogUserFactory()
      .create({
        ...dto,
        passwordHash: '',
        registrationDate: new Date(),
        subscribers: [],
        subscribersNotifyDate: new Date(),
      })
      .setPassword(dto.password);

    await this.blogUserRepository.save(entity);

    return entity;
  }

  public async getById(id: string): Promise<BlogUserEntity> {
    const user = await this.blogUserRepository.findById(id);
    if (!user) {
      throw new NotFoundException(UserMessage.NotFound);
    }

    return user;
  }

  public async findAll({ userIds }: UserQuery) {
    return this.blogUserRepository.findByIds(userIds);
  }

  public async changePassword(id: string, { password, newPassword }: ChangePasswordDTO) {
    const user = await this.getById(id);

    if (!(await user.comparePassword(password))) {
      throw new BadRequestException(UserMessage.WrongPassword);
    }
    if (password === newPassword) {
      throw new BadRequestException(UserMessage.IdenticalPassword);
    }
    const updatedUser = await user.setPassword(newPassword);

    await this.blogUserRepository.update(updatedUser);
    return updatedUser;
  }

  public async findByEmail(email: string): Promise<Nullable<BlogUserEntity>> {
    return this.blogUserRepository.findByEmail(email);
  }

  public async findSubscriptions(userId: string): Promise<BlogUserEntity[]> {
    return this.blogUserRepository.findSubscriptions(userId);
  }

  public async subscribe(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new BadRequestException(UserMessage.SubscribeLoop);
    }
    const user = await this.getById(userId);
    const targetUser = await this.getById(targetUserId);

    if (targetUser.subscribers.includes(user.id)) {
      throw new ConflictException(UserMessage.SubscriptFound);
    }

    targetUser.subscribers.push(user.id);
    await this.blogUserRepository.update(targetUser);
  }

  public async unsubscribe(userId: string, targetUserId: string): Promise<void> {
    const targetUser = await this.getById(targetUserId);

    if (!targetUser.subscribers.includes(userId)) {
      throw new NotFoundException(UserMessage.SubscriptNotFound);
    }

    targetUser.updateSubscribers(userId);
    await this.blogUserRepository.update(targetUser);
  }
}
