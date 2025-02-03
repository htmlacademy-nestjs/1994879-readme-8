import {
  Entity,
  LinkPost,
  PhotoPost,
  PostStatus,
  PostType,
  QuotePost,
  TextPost,
  VideoPost,
} from '@project/core';
import { StorableEntity, Post } from '@project/core';

export class PostEntity extends Entity implements StorableEntity<Post> {
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
  repost?: PostEntity;
  isRepost: boolean;
  originalId: string;
  originalUserId: string;
  commentsCount: number;
  likesCount: number;

  constructor(post: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }
    console.log(11111, post);

    this.id = post.id ?? undefined;
    this.type = post.type;
    this.status = post.status;
    this.publicationDate = post.publicationDate;
    this.userId = post.userId;
    this.tags = post.tags;
    this.isRepost = !!post.repost;
    this.originalId = post.repost?.id;
    this.originalUserId = post.repost?.userId;
    this.commentsCount = post._count?.comments;
    this.likesCount = post._count?.likes;

    switch (post.type) {
      case PostType.Video: {
        const { title, url } = post as VideoPost;
        this.title = title;
        this.url = url;
        break;
      }
      case PostType.Text: {
        const { title, description, text } = post as TextPost;
        this.title = title;
        this.description = description;
        this.text = text;
        break;
      }
      case PostType.Photo: {
        const { url } = post as PhotoPost;
        this.url = url;
        break;
      }
      case PostType.Link: {
        const { url, description } = post as LinkPost;
        this.url = url;
        this.description = description;
        break;
      }
      case PostType.Quote: {
        const { author, text } = post as QuotePost;
        this.author = author;
        this.text = text;
        break;
      }
    }
  }

  public toPOJO(): Post {
    const basePost = {
      id: this.id,
      type: this.type,
      status: this.status,
      publicationDate: this.publicationDate,
      userId: this.userId,
      tags: this.tags,
      isRepost: this.isRepost,
      originalId: this.originalId,
      originalUserId: this.originalUserId,
      title: undefined,
      description: undefined,
      url: undefined,
      text: undefined,
      author: undefined,
    };

    switch (this.type) {
      case PostType.Video:
        return {
          ...basePost,
          title: this.title,
          url: this.url,
        } as VideoPost;

      case PostType.Text:
        return {
          ...basePost,
          title: this.title,
          description: this.description,
          text: this.text,
        } as TextPost;

      case PostType.Photo:
        return {
          ...basePost,
          url: this.url,
        } as PhotoPost;

      case PostType.Link:
        return {
          ...basePost,
          url: this.url,
          description: this.description,
        } as LinkPost;

      case PostType.Quote:
        return {
          ...basePost,
          author: this.author,
          text: this.text,
        } as QuotePost;
    }
  }
}
