import { IsEnum, IsOptional, IsString, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { PostType, PostStatus } from '@project/core';

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsDate()
  publicationDate: Date;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsArray()
  favorites?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  isRepost?: boolean;

  @IsOptional()
  @IsString()
  originalId?: string;
}
