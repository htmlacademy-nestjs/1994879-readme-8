import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsDate,
  IsNotEmpty,
  Length,
  IsUrl,
  ArrayMaxSize,
} from 'class-validator';
import { PostType, PostStatus } from '@project/core';
import { ApiProperty } from '@nestjs/swagger';
import {
  AuthorLimit,
  DescriptionLimit,
  PostSwaggerMessage,
  TagsLimit,
  TextLimit,
  TitleLimit,
} from '../post.constant';

export class CreatePostDto {
  @IsEnum(PostType)
  @ApiProperty({ required: true, enum: PostType, ...PostSwaggerMessage.type })
  type: PostType;

  @IsEnum(PostStatus)
  @ApiProperty({ required: true, enum: PostStatus, ...PostSwaggerMessage.status })
  status: PostStatus;

  @IsDate()
  @ApiProperty({ required: true, ...PostSwaggerMessage.publicationDate })
  publicationDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(TagsLimit.Max, { message: TagsLimit.Description })
  @Length(TagsLimit.ItemMin, TagsLimit.ItemMax, { each: true, message: TagsLimit.ItemsDescription })
  @ApiProperty({ ...PostSwaggerMessage.tags })
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, ...PostSwaggerMessage.userId })
  userId: string;

  @IsOptional()
  @IsString()
  @Length(TitleLimit.Min, TitleLimit.Max, { message: TitleLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.title })
  title?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ ...PostSwaggerMessage.url })
  url?: string;

  @IsOptional()
  @IsString()
  @Length(DescriptionLimit.Min, DescriptionLimit.Max, { message: DescriptionLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.description })
  description?: string;

  @IsOptional()
  @IsString()
  @Length(TextLimit.Min, TextLimit.Max, { message: TextLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.text })
  text?: string;

  @IsOptional()
  @IsString()
  @Length(AuthorLimit.Min, AuthorLimit.Max, { message: AuthorLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.author })
  author?: string;
}
