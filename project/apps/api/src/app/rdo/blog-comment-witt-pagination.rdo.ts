import { PaginationRDO } from '@project/core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BlogCommentRDO } from './blog-comment.rdo';

export class BlogCommentWithPaginationRDO extends PaginationRDO<BlogCommentRDO> {
  @Expose()
  @ApiProperty({ type: () => BlogCommentRDO, isArray: true })
  @Type(() => BlogCommentRDO)
  public entities: BlogCommentRDO[];
}
