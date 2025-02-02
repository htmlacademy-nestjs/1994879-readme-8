import { PostStatus } from './post-status.enum';
import { PostType } from './post-type.enum';

interface ReferenceCount {
  likes: number;
  comments: number;
}

interface BasePost {
  id?: string;
  type: PostType;
  status: PostStatus;
  publicationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  tags: string[];
  userId: string;
  repost?: BasePost;
  _count?: ReferenceCount;
  originalId?: string;
  originalUserId?: string;
  likesCount?: number;
  commentsCount?: number;
}

export interface VideoPost extends BasePost {
  type: PostType.Video;
  title: string;
  url: string;
}

export interface TextPost extends BasePost {
  type: PostType.Text;
  title: string;
  description: string;
  text: string;
}

export interface PhotoPost extends BasePost {
  type: PostType.Photo;
  url: string;
}

export interface LinkPost extends BasePost {
  type: PostType.Link;
  url: string;
  description: string;
}

export interface QuotePost extends BasePost {
  type: PostType.Quote;
  author: string;
  text: string;
}

export type Post = VideoPost | TextPost | PhotoPost | LinkPost | QuotePost;
