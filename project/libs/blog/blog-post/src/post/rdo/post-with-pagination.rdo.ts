import { Expose, Type } from 'class-transformer';
import { PostRDO } from './post.rdo';

export class PostWithPaginationRDO {
  @Expose()
  @Type(() => PostRDO)
  public entities: PostRDO[];

  @Expose()
  public totalPages: number;

  @Expose()
  public totalItems: number;

  @Expose()
  public currentPage: number;

  @Expose()
  public itemsPerPage: number;
}
