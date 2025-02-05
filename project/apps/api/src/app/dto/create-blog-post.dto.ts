import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { PostType, SwaggerPostProperty } from '@project/core';

import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateBlogPostDTO {
  @IsEnum(PostType)
  @IsString()
  @ApiProperty({ required: true, enum: PostType })
  public type: PostType;

  @IsOptional()
  @IsEnum(PostStatus)
  @IsString()
  @ApiProperty({ enum: PostStatus })
  public status?: PostStatus;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  public publicationDate?: Date;

  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ isArray: true, type: String })
  public tags?: string[];

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  url: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  title: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  text: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  author: string;

  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @Matches(/\.(jpg|png)$/)
  public photo?: Express.Multer.File;
}
