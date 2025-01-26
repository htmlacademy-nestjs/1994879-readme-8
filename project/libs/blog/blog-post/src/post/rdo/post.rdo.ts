import { PostStatus, PostType } from '@project/core';
import { Expose, Transform } from 'class-transformer';

export class PostRDO {
  @Expose()
  public id: string;

  @Expose()
  public type: PostType;

  @Expose()
  public status: PostStatus;

  @Expose()
  public publicationDate: Date;

  @Expose()
  @Transform(({ value }) => value.map(({ name }) => name), { toClassOnly: true })
  tags?: string[];

  @Expose()
  public userId: string;

  @Expose()
  public title?: string;

  @Expose()
  public url?: string;

  @Expose()
  public description?: string;

  @Expose()
  public text?: string;

  @Expose()
  public author?: string;
}
