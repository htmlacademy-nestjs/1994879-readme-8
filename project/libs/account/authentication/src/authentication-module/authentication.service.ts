import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BlogUserRepository, BlogUserEntity } from '@project/blog-user';
import { AuthMessage } from './authentication.constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthUser } from '@project/core';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly blogUserRepository: BlogUserRepository
  ) {}

  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const { email, name, password, avatar } = dto;

    const blogUser = {
      email,
      name,
      avatar,
      passwordHash: '',
    };

    const existUser = await this.blogUserRepository.findByEmail(email);
    if (existUser) {
      throw new ConflictException(AuthMessage.Exists);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password)
    this.blogUserRepository.save(userEntity);

    return userEntity;
  }

  private async checkUserPassword(user: BlogUserEntity, password: string): Promise<void> {
    if (!await user.comparePassword(password)) {
      throw new UnauthorizedException(AuthMessage.WrongPassword);
    }
  }

  public async verifyUser(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AuthMessage.NotFound);
    }

    await this.checkUserPassword(existUser, password);
    return existUser;
  }

  public async getUser(id: string) {
    const user = await this.blogUserRepository.findById(id);
    if (!user) {
      throw new NotFoundException(AuthMessage.NotFound);
    }

    return user;
  }

  public async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.getUser(id);
    await this.checkUserPassword(user, dto.password);

    const updatedUser = await user.setPassword(dto.newPassword);
    this.blogUserRepository.update(updatedUser);

    return updatedUser;
  }
}
