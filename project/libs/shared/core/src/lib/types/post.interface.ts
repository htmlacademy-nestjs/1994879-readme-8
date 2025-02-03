import { Nullable } from '../interfaces/nullable';
import { PostStatus } from './post-status.enum';
import { PostType } from './post-type.enum';

export interface CommonPost {
  id?: string;
  type: PostType;
  status: PostStatus;
  publicationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  userId: string;
  isRepost: boolean;
  originalId?: string;
  originalUserId?: string;

  title?: string;
  description?: string;
  text?: string;
  author?: string;
  url?: string;

  likesCount?: number;
  commentsCount?: number;
}
