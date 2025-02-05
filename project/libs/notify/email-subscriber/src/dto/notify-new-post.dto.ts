import { IsArray, IsString } from 'class-validator';
import { PostRDO } from '@project/blog-post';
import { Type } from 'class-transformer';
import { UserRDO } from '@project/blog-user';

export class NotifyNewPostsDTO {
  @IsString()
  @IsArray()
  subscribers: UserRDO[];

  @Type(() => PostRDO)
  public entities: PostRDO[];
}
