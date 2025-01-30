import { Expose, Type } from 'class-transformer';
import { PostRDO } from './post.rdo';

export class PostWithPaginationRDO {
  @Expose()
  public totalPages: number;

  @Expose()
  public totalItems: number;

  @Expose()
  public currentPage: number;

  @Expose()
  public itemsPerPage: number;

  @Expose()
  @Type(() => PostRDO)
  public entities: PostRDO[];
}
