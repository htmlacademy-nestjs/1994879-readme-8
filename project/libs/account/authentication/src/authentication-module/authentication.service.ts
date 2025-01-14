import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogUserRepository, BlogUserEntity } from '@project/blog-user';
import { AuthMessage } from './authentication.constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenPayload, User } from '@project/core';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService
  ) {}

  public async createUserToken(user: User): Promise<Token> {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken, refreshToken: '' };
    } catch (error) {
      throw new HttpException(AuthMessage.JWTCreateError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const existUser = await this.blogUserRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException(AuthMessage.Exists);
    }

    const userEntity = await new BlogUserEntity({ ...dto, passwordHash: '' }).setPassword(
      dto.password
    );
    await this.blogUserRepository.save(userEntity);

    return userEntity;
  }

  private async checkUserPassword(user: BlogUserEntity, password: string): Promise<void> {
    if (!(await user.comparePassword(password))) {
      throw new UnauthorizedException(AuthMessage.WrongPassword);
    }
  }

  public async verifyUser({ email, password }: LoginUserDto) {
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

  public async changePassword(id: string, { password, newPassword }: ChangePasswordDto) {
    const user = await this.getUser(id);
    await this.checkUserPassword(user, password);

    const updatedUser = await user.setPassword(newPassword);
    await this.blogUserRepository.update(updatedUser);

    return updatedUser;
  }
}
