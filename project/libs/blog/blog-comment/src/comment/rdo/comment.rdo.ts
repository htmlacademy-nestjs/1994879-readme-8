import { Expose } from 'class-transformer';

export class CommentRDO {
  @Expose()
  public id: string;

  @Expose()
  public postId: string;

  @Expose()
  public userId: string;

  @Expose()
  public message: string;

  @Expose({ name: 'createdAt' })
  public createDate: Date;
}
