import { PaginationRDO } from '@project/core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BlogPostRDO } from './blog-post.rdo';

export class BlogPostWithPaginationRDO extends PaginationRDO<BlogPostRDO> {
  @Expose()
  @ApiProperty({ type: () => BlogPostRDO, isArray: true })
  @Type(() => BlogPostRDO)
  public entities: BlogPostRDO[];
}
