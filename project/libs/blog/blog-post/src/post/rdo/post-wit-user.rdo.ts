import { Expose } from 'class-transformer';
import { PostRDO } from './post.rdo';
import { UserRDO } from '@project/blog-user';

export class PostWithUserRDO extends PostRDO {
  @Expose()
  user: UserRDO;
}
