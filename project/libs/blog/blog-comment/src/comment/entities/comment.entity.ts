import { Comment, Entity, StorableEntity } from '@project/core';

export class CommentEntity extends Entity implements StorableEntity<Comment> {
  public createdAt?: Date;
  public updatedAt?: Date;
  public postId: string;
  public message: string;
  public userId: string;

  constructor(comment?: Comment) {
    super();
    this.populate(comment);
  }

  public populate(comment?: Comment): void {
    if (!comment) {
      return;
    }

    this.id = comment.id ?? undefined;
    this.createdAt = comment.createdAt ?? new Date();
    this.updatedAt = comment.updatedAt ?? new Date();
    this.message = comment.message;
    this.postId = comment.postId;
    this.userId = comment.userId;
  }

  public toPOJO(): Comment {
    return {
      id: this.id,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
      postId: this.postId,
    };
  }
}
