import { PaginationRDO } from '@project/core';
import { CommentRDO } from './comment.rdo';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CommentWithPaginationRDO extends PaginationRDO<CommentRDO> {
  @Expose()
  @ApiProperty({ type: () => CommentRDO, isArray: true })
  @Type(() => CommentRDO)
  public entities: CommentRDO[];
}
