import { Expose } from 'class-transformer';
import { PostRDO } from './post.rdo';
import { UserRDO } from '@project/authentication';

export class PostWithUserRDO extends PostRDO {
  @Expose()
  user: UserRDO;
}
