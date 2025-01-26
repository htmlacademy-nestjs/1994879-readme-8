import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsDate,
  Length,
  IsUrl,
  ArrayMaxSize,
  IsMongoId,
  ValidateIf,
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

export class CreatePostDTO {
  @IsEnum(PostType)
  @ApiProperty({ required: true, enum: PostType, ...PostSwaggerMessage.type })
  public type: PostType;

  @IsEnum(PostStatus)
  @ApiProperty({ required: true, enum: PostStatus, ...PostSwaggerMessage.status })
  public status: PostStatus;

  @IsDate()
  @ApiProperty({ required: true, ...PostSwaggerMessage.publicationDate })
  public publicationDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(TagsLimit.Max, { message: TagsLimit.Description })
  @Length(TagsLimit.ItemMin, TagsLimit.ItemMax, { each: true, message: TagsLimit.ItemsDescription })
  @ApiProperty({ ...PostSwaggerMessage.tags })
  public tags?: string[];

  @IsString()
  @IsMongoId()
  @ApiProperty({ required: true, ...PostSwaggerMessage.userId })
  public userId: string;

  @ValidateIf((o) => o.type === PostType.Video || o.type === PostType.Text)
  @IsOptional()
  @IsString()
  @Length(TitleLimit.Min, TitleLimit.Max, { message: TitleLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.title })
  public title?: string;

  @ValidateIf((o) => o.type === PostType.Video || o.type === PostType.Link)
  @IsOptional()
  @IsUrl()
  @ApiProperty({ ...PostSwaggerMessage.url })
  public url?: string;

  @ValidateIf((o) => o.type === PostType.Text)
  @IsOptional()
  @IsString()
  @Length(DescriptionLimit.Min, DescriptionLimit.Max, { message: DescriptionLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.description })
  public description?: string;

  @ValidateIf((o) => o.type === PostType.Text || o.type === PostType.Quote)
  @IsOptional()
  @IsString()
  @Length(TextLimit.Min, TextLimit.Max, { message: TextLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.text })
  public text?: string;

  @ValidateIf((o) => o.type === PostType.Quote)
  @IsOptional()
  @IsString()
  @Length(AuthorLimit.Min, AuthorLimit.Max, { message: AuthorLimit.Description })
  @ApiProperty({ ...PostSwaggerMessage.author })
  public author?: string;
}
