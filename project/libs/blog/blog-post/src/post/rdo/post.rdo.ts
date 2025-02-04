import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType, SwaggerPostProperty, SwaggerUserProperty } from '@project/core';
import { Expose, Transform } from 'class-transformer';

export class PostRDO {
  @Expose()
  @ApiProperty(SwaggerPostProperty.postId)
  public id: string;

  @Expose()
  @ApiProperty(SwaggerPostProperty.type)
  public type: PostType;

  @Expose()
  @ApiProperty(SwaggerPostProperty.status)
  public status: PostStatus;

  @Expose()
  @ApiProperty(SwaggerPostProperty.publicationDate)
  public publicationDate: Date;

  @Expose()
  @ApiProperty(SwaggerPostProperty.tags)
  tags?: string[];

  @Expose()
  @ApiProperty(SwaggerUserProperty.userId)
  public userId: string;

  @Expose()
  @ApiProperty(SwaggerPostProperty.title)
  public title?: string;

  @Expose()
  @ApiProperty(SwaggerPostProperty.url)
  public url?: string;

  @Expose()
  @ApiProperty(SwaggerPostProperty.description)
  public description?: string;

  @Expose()
  @ApiProperty(SwaggerPostProperty.text)
  public text?: string;

  @Expose()
  @ApiProperty(SwaggerPostProperty.author)
  public author?: string;

  @Expose()
  public isRepost: boolean;

  @Expose()
  public originalId: string;

  @Expose()
  public originalUserId: string;

  @Expose()
  public commentsCount: number;

  @Expose()
  public likesCount: number;
}
