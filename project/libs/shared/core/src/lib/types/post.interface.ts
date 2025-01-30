import { PostStatus } from './post-status.enum';
import { PostType } from './post-type.enum';

interface BasePost {
  id?: string;
  type: PostType;
  status: PostStatus;
  publicationDate: Date;
  tags: string[];
  userId: string;
  isRepost: boolean;
  originalId: string;
  originalUserId: string;
  likesCount: number;
  commentsCount: number;
}

export interface VideoPost extends BasePost {
  type: PostType.Video;
  title: string;
  url: string;
  text: string;
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
  description?: string;
}

export interface QuotePost extends BasePost {
  type: PostType.Quote;
  author: string;
  text: string;
}

export type Post = VideoPost | TextPost | PhotoPost | LinkPost | QuotePost;
