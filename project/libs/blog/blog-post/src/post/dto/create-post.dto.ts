import { PostType, SwaggerPostProperty } from '@project/core';
import { BasePostDTO } from './base-post.dto';
import { IsString, IsUrl, Length, Matches } from 'class-validator';
import {
  AuthorLimit,
  DescriptionLimit,
  LinkTextLimit,
  QuoteTextLimit,
  TextLimit,
  TitleLimit,
  UrlLimit,
} from '../post.constant';
import { ApiProperty } from '@nestjs/swagger';

export class VideoPostDTO extends BasePostDTO {
  @ApiProperty({ enum: [PostType.Video], default: PostType.Video })
  type: PostType.Video;

  @IsString()
  @Length(TitleLimit.Min, TitleLimit.Max, { message: TitleLimit.Description })
  @ApiProperty(SwaggerPostProperty.title)
  title: string;

  @IsUrl()
  @Matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/, { message: UrlLimit.Youtube })
  @ApiProperty(SwaggerPostProperty.url)
  url: string;
}

export class TextPostDTO extends BasePostDTO {
  @ApiProperty({ enum: [PostType.Text], default: PostType.Text })
  type: PostType.Text;

  @IsString()
  @Length(TitleLimit.Min, TitleLimit.Max, { message: TitleLimit.Description })
  @ApiProperty(SwaggerPostProperty.title)
  title: string;

  @IsString()
  @Length(DescriptionLimit.Min, DescriptionLimit.Max, { message: DescriptionLimit.Description })
  @ApiProperty(SwaggerPostProperty.description)
  description: string;

  @IsString()
  @Length(TextLimit.Min, TextLimit.Max, { message: TextLimit.Description })
  @ApiProperty(SwaggerPostProperty.text)
  text: string;
}

export class PhotoPostDTO extends BasePostDTO {
  @ApiProperty({ enum: [PostType.Photo], default: PostType.Photo })
  type: PostType.Photo;

  @IsString()
  @ApiProperty(SwaggerPostProperty.path)
  url: string;
}

export class LinkPostDTO extends BasePostDTO {
  @ApiProperty({ enum: [PostType.Link], default: PostType.Link })
  type: PostType.Link;

  @IsUrl()
  @ApiProperty(SwaggerPostProperty.url)
  url: string;

  @IsString()
  @Length(LinkTextLimit.Min, LinkTextLimit.Max, { message: LinkTextLimit.Description })
  @ApiProperty(SwaggerPostProperty.description)
  description?: string;
}

export class QuotePostDTO extends BasePostDTO {
  @ApiProperty({ enum: [PostType.Quote], default: PostType.Quote })
  type: PostType.Quote;

  @IsString()
  @Length(AuthorLimit.Min, AuthorLimit.Max, { message: AuthorLimit.Description })
  @ApiProperty(SwaggerPostProperty.author)
  author: string;

  @IsString()
  @Length(QuoteTextLimit.Min, QuoteTextLimit.Max, { message: QuoteTextLimit.Description })
  @ApiProperty(SwaggerPostProperty.text)
  text: string;
}

export type CreatePostDTO = VideoPostDTO | TextPostDTO | LinkPostDTO | PhotoPostDTO | QuotePostDTO;
