import { CommonPost, Entity, PostStatus, PostType } from '@project/core';
import { StorableEntity } from '@project/core';

export class PostEntity extends Entity implements StorableEntity<CommonPost> {
  type: PostType;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  publicationDate: Date;
  userId: string;
  title?: string;
  description?: string;
  url?: string;
  text?: string;
  author?: string;
  tags?: string[];
  isRepost: boolean;
  originalId: string;
  originalUserId: string;
  commentsCount: number;
  likesCount: number;

  constructor(post?: CommonPost) {
    super();
    this.populate(post);
  }

  public populate(post?: CommonPost): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? undefined;
    this.type = post.type;
    this.status = post.status ?? PostStatus.Published;
    this.publicationDate = post.publicationDate;
    this.userId = post.userId;
    this.tags = post.tags ?? [];
    this.isRepost = post.isRepost;
    this.originalId = post.originalId ?? undefined;
    this.originalUserId = post.originalUserId ?? undefined;
    this.commentsCount = post.commentsCount;
    this.likesCount = post.likesCount;

    switch (post.type) {
      case PostType.Video: {
        this.title = post.title;
        this.url = post.url;
        break;
      }
      case PostType.Text: {
        this.title = post.title;
        this.description = post.description;
        this.text = post.text;
        break;
      }
      case PostType.Photo: {
        this.url = post.url;
        break;
      }
      case PostType.Link: {
        this.url = post.url;
        this.description = post.description;
        break;
      }
      case PostType.Quote: {
        this.author = post.author;
        this.text = post.text;
        break;
      }
    }
  }

  public toPOJO(): CommonPost {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      publicationDate: this.publicationDate,
      userId: this.userId,
      tags: this.tags,
      isRepost: this.isRepost,
      originalId: this.originalId,
      originalUserId: this.originalUserId,
      commentsCount: this.commentsCount,
      likesCount: this.likesCount,

      title: this.title,
      description: this.description,
      url: this.url,
      author: this.author,
      text: this.text,
    };
  }
}
