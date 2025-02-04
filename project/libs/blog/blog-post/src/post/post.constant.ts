import { SortDirection, SortType } from '@project/core';

export const PostMessage = {
  NotFound: 'Post not found',
  AccessDeny: 'Unable to modify post you are not created',
  RepostSelf: "You can't repost your own publication",
  RepostExists: 'You already repost this post',
};

export const PostSwaggerQuery = {
  limit: { name: 'limit', required: false, type: Number, description: 'Number of posts to return' },
  tags: {
    name: 'tags',
    required: false,
    type: String,
    description: 'Array of tag strings',
  },
  sort: {
    name: 'sortDirection',
    required: false,
    enum: SortDirection,
    default: SortDirection.Desc,
    description: 'Direction to sort the posts',
  },
  page: { name: 'page', required: false, type: Number, description: 'Page number for pagination' },
} as const;

export const QueryDefaults = {
  Limit: 25,
  Page: 1,
  SortDirection: SortDirection.Desc,
  SortType: SortType.CreatedAt,
} as const;

export const TitleLimit = {
  Min: 20,
  Max: 50,
  Description: `The title of the post must be between 20 and 50 characters`,
} as const;

export const DescriptionLimit = {
  Min: 50,
  Max: 255,
  Description: 'A description of the post must be between 50 and 255 characters',
} as const;

export const TextLimit = {
  Min: 100,
  Max: 1024,
  Description: 'A text of the post must be between 100 and 1024 characters',
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
  Max: 300,
  Description: 'Text length maximum 300 characters',
} as const;

export const TagsLimit = {
  Max: 8,
  Description: 'Maximum 8 tags available',
  ItemMin: 3,
  ItemMax: 10,
  ItemsDescription: 'Tag length must be between 3 and 10 character',
} as const;

export const UrlLimit = {
  Youtube: 'URL must be a valid YouTube URL',
};
