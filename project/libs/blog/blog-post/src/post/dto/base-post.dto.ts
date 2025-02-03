import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '@prisma/client';
import { SwaggerPostProperty, SwaggerUserProperty } from '@project/core';
import { ArrayMaxSize, IsEnum, IsMongoId, IsOptional, IsString, Length } from 'class-validator';
import { TagsLimit } from '../post.constant';
import { Transform } from 'class-transformer';

export class BasePostDTO {
  @IsEnum(PostType)
  @IsString()
  @ApiProperty({ required: true, enum: PostType })
  public type: PostType;

  @IsEnum(PostStatus)
  @IsString()
  @ApiProperty({ required: true, enum: PostStatus })
  @ApiProperty(SwaggerPostProperty.status)
  public status: PostStatus;

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

  @IsString()
  @IsMongoId()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerUserProperty.userId)
  public userId: string;
}
