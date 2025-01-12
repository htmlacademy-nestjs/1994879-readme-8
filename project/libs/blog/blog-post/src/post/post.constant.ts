import { PostStatus } from '@prisma/client';
import { PostType } from '@project/core';

export enum PostOperationSummary {
  Create = 'Create a new post',
  FindAll = 'Get all posts',
  FindOne = 'Get a post by ID',
  Update = 'Update a post by ID',
  Remove = 'Delete a post by ID',
}

export enum PostResponseDescription {
  Created = 'The post has been successfully created.',
  BadRequest = 'Bad Request.',
  AllPosts = 'List of posts.',
  Found = 'The post found.',
  NotFound = 'Post not found.',
  Updated = 'The post has been successfully updated.',
  Deleted = 'The post has been successfully deleted.',
}

export const PostSwaggerMessage = {
  id: { description: 'Post ID', example: '3d11998b-f67f-480e-98ad-03bad6a22b64' },
  type: {
    description: 'The type of the post (e.g., Video, Text, Photo, Link, Quote).',
    example: PostType.Video,
  },
  status: {
    description: 'The status of the post (e.g., Draft, Published).',
    example: PostStatus.Published,
  },
  publicationDate: {
    description: 'The date and time when the post will be published.',
    example: '2023-10-01T12:00:00Z',
  },
  userId: { description: 'The ID of the user creating the post.', example: 'user123' },
  tags: { description: 'An array of tags associated with the post.', example: ['news', 'updates'] },
  favorites: {
    description: 'An array of user IDs who have favorited the post.',
    example: ['user456', 'user789'],
  },
  title: {
    description: 'The title of the post (applicable for Video and Text posts).',
    example: 'My First Video',
  },
  url: {
    description: 'The URL of the post content (applicable for Video, Photo, and Link posts).',
    example: 'https://example.com/video.mp4',
  },
  description: {
    description: 'A brief description of the post (applicable for Text and Link posts).',
    example: 'This is a description of the post.',
  },
  text: {
    description: 'The main text content of the post (applicable for Text and Quote posts).',
    example: 'This is the main content of the post.',
  },
  author: {
    description: 'The author of the quote (applicable for Quote posts).',
    example: 'Ernest Hemingway',
  },
  isRepost: { description: 'Indicates whether the post is a repost.', example: true },
  originalId: {
    description: 'The ID of the original post if this is a repost.',
    example: '3d11998b-f67f-480e-98ad-03bad6a22b65',
  },
} as const;

export const TitleLimit = {
  Min: 20,
  Max: 50,
  Description: `The title of the post must be between 20 and 50 characters`,
} as const;

export const DescriptionLimit = {
  Min: 50,
  Max: 255,
  Description: 'A brief description of the post must be between 50 and 255 characters',
} as const;

export const TextLimit = {
  Min: 100,
  Max: 1024,
  Description: 'A text of the post must be between 50 and 255 characters',
} as const;

export const QuoteTextLimit = {
  Min: 20,
  Max: 300,
  Description: 'A text of the post must be between 20 and 300 characters',
} as const;

export const AuthorLimit = {
  Min: 3,
  Max: 50,
  Description: 'Author field length must be between 20 and 300 characters',
} as const;

export const LinkTextLimit = {
  Min: 0,
  Max: 30,
  Description: 'Text length maximum 30 characters',
} as const;

export const TagsLimit = {
  Max: 8,
  Description: 'Maximum 8 tags available',
  ItemMin: 3,
  ItemMax: 10,
  ItemsDescription: 'Tag length must be between 3 and 10 character',
} as const;
