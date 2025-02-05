import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CommentRDO } from '@project/blog-comment';
import { Expose, Type } from 'class-transformer';
import { AuthorRDO } from './author.rdo';
import { SwaggerUserProperty } from '@project/core';

export class BlogCommentRDO extends OmitType(CommentRDO, ['userId'] as const) {
  @Expose()
  @ApiProperty(SwaggerUserProperty.userId)
  @Type(() => AuthorRDO)
  public user: AuthorRDO;
}
