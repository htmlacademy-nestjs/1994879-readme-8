import { Entity, Like, StorableEntity } from '@project/core';

export class LikeEntity extends Entity implements StorableEntity<Like> {
  public userId!: string;
  public postId!: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(like?: Like) {
    super();
    this.populate(like);
  }
  public populate(like?: Like): void {
    if (!like) {
      return;
    }
    const { userId, postId } = like;

    this.userId = userId;
    this.postId = postId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toPOJO(): Like {
    return {
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
