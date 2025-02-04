import { ApiProperty } from '@nestjs/swagger';
import { PostType, SwaggerPostProperty } from '@project/core';
import {
  ArrayMaxSize,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { PostStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { AuthorLimit, DescriptionLimit, TagsLimit, TextLimit, TitleLimit } from '../post.constant';

export class UpdatePostDTO {
  @IsEnum(PostType)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: true, enum: PostType })
  public type: PostType;

  @IsOptional()
  @IsEnum(PostStatus)
  @IsString()
  @ApiProperty({ enum: PostStatus })
  @ApiProperty(SwaggerPostProperty.status)
  public status?: PostStatus;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerPostProperty.publicationDate)
  public publicationDate?: Date;

  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(TagsLimit.Max, { message: TagsLimit.Description })
  @Length(TagsLimit.ItemMin, TagsLimit.ItemMax, { each: true, message: TagsLimit.ItemsDescription })
  @Transform(({ value }) => {
    if (value) {
      const lowercased = value.map((item: string) => item.toLowerCase());
      return Array.from(new Set(lowercased));
    }
    return value;
  })
  @ApiProperty(SwaggerPostProperty.tags)
  public tags?: string[];

  @IsOptional()
  @IsString()
  @Length(TitleLimit.Min, TitleLimit.Max, { message: TitleLimit.Description })
  @ApiProperty(SwaggerPostProperty.title)
  title: string;

  @IsOptional()
  @IsString()
  @Length(DescriptionLimit.Min, DescriptionLimit.Max, { message: DescriptionLimit.Description })
  @ApiProperty(SwaggerPostProperty.description)
  description: string;

  @IsOptional()
  @IsString()
  @Length(TextLimit.Min, TextLimit.Max, { message: TextLimit.Description })
  @ApiProperty(SwaggerPostProperty.text)
  text: string;

  @IsOptional()
  @IsString()
  @Length(AuthorLimit.Min, AuthorLimit.Max, { message: AuthorLimit.Description })
  @ApiProperty(SwaggerPostProperty.author)
  author: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty(SwaggerPostProperty.url)
  url: string;
}
