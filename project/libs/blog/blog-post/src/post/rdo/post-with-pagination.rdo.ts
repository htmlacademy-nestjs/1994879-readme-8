// import { Expose, Type } from 'class-transformer';
import { PostRDO } from './post.rdo';
import { PaginationRDO } from '@project/core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PostWithPaginationRDO extends PaginationRDO<PostRDO> {
  @Expose()
  @Type(() => PostRDO)
  @ApiProperty({ type: () => PostRDO, isArray: true })
  public entities: PostRDO[];
}
