import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AuthorRDO } from './author.rdo';
import { SwaggerUserProperty } from '@project/core';
import { PostRDO } from '@project/blog-post';

export class BlogPostRDO extends OmitType(PostRDO, ['userId'] as const) {
  @Expose()
  @ApiProperty(SwaggerUserProperty.userId)
  @Type(() => AuthorRDO)
  public user: AuthorRDO;
}
