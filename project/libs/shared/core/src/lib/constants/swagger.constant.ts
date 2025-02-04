import { SortDirection } from '../types/sort-direction.enum';
import { PostStatus } from '../types/post-status.enum';
import { PostType } from '../types/post-type.enum';
import { AppHeader } from './app.config';

export enum SwaggerTag {
  Auth = 'Authorization routes',
  Blog = 'Blog routes',
  User = 'User routes',
  File = 'File vault',
  Notify = 'Notify service',
  Post = 'Routes for posts',
  Comment = 'Routes for comments',
  Like = 'Like routes',
  Feed = 'My feed',
}

export enum SwaggerOperation {
  Register = 'Register new user',
  GetUsers = 'Get users by ids',
  GetUser = 'Get user info by id',
  ChangePassword = 'Change users password',
  Subscribe = 'Subscribe to user',
  Unsubscribe = 'Unsubscribe from user',
  Subscriptions = 'List of user subscriptions',
  Login = 'Basic Authorization by login and password',
  RefreshToken = 'Get new pair access, refresh token',
  CheckAuth = 'Validate access token',
  Feed = 'Users feed',
  PostCreate = 'Create a new post',
  PostAll = 'Get all posts',
  PostOne = 'Get a post by ID',
  PostUpdate = 'Update a post by ID',
  PostRemove = 'Delete a post by ID',
  PostCount = 'Count users post',
  Repost = 'Repost publication',
  Search = 'Search posts by title',
  Like = 'Like post',
  Unlike = 'Unlike post',
  NotiFyNewUser = 'Welcome email for a new user',
  NotifyRenewalPosts = 'Newsletter about new posts',
  CommentCreate = 'Create a new comment for post',
  CommentList = 'Get list of comments',
  CommentDelete = 'Delete a comment by ID',
}

export const SwaggerUserProperty = {
  userId: { description: 'User ID', example: '67990a7d50e42db86a17146b' },
  userIds: { description: 'Array of user Ids', example: '' },
  name: { description: 'User name', example: 'Keks' },
  avatar: { description: 'User avatar', example: 'keks-avatar.png' },
  email: { description: 'Email', example: 'keks-the-cat@gmail.com' },
  password: { description: 'User password', example: '123456' },
  accessToken: { description: 'Access token', example: 'WDwFsqLk...' },
  refreshToken: { description: 'Refresh token', example: 'KxwOSwAs...' },
  registrationDate: { description: 'Registration date', example: '2023-10-01T12:00:00Z' },
  publicationCount: { description: 'Publication count', example: 0 },
  subscribersCount: { description: 'Subscribers count', example: 4 },
};

export const SwaggerPostProperty = {
  postId: { description: 'Post ID', example: 'cm6ictinr0000s13gdekn4rgu' },
  type: {
    description: 'The type of the post (e.g., Video, Text, Photo, Link, Quote).',
    example: PostType.Video,
  },
  status: {
    description: 'The status of the post (e.g., Draft, Published).',
    example: PostStatus.Published,
  },
  publicationDate: {
    description: 'Publication date',
    example: '2023-10-01T12:00:00Z',
  },
  tags: { description: 'An array of tags associated with the post.', example: ['news', 'updates'] },
  title: {
    description: 'The title of the post (applicable for Video and Text posts).',
    example: 'My First Video',
  },
  url: {
    description: 'The URL of the post content.',
    example: 'https://youtube.com/video.mp4',
  },
  path: {
    description: 'The URL of the phot post.',
    example: '/path/to/file-vault',
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
  originalId: {
    description: 'The ID of the original post if this is a repost.',
    example: '123',
  },
} as const;

export const SwaggerCommentProperty = {
  message: {
    description: 'Text of the comment.',
    example: 'Excellent article! When will there be a sequel?',
  },
};

export enum SwaggerResponse {
  Unauthorized = 'Unauthorized error',
  BadRequest = 'Bad request error',
  NotFound = 'Not Found error',
  LoggedSuccess = 'User has been successfully logged.',
  LoggedError = 'Password or Login is wrong.',
  UserFound = 'User found',
  UserNotFound = 'User not found',
  UserExist = 'User with the email already exists',
  UserCreated = 'The new user has been successfully created.',
  Updated = 'User password updated',
  RefreshToken = 'Get a new access/refresh tokens',
  Feed = 'Users feed',
  LikeSuccess = 'Post liked',
  LikeExists = 'Like already exists',
  LikeNotFound = 'Like not found',
  LikeDeleted = 'Post unliked',
  PostCreated = 'The post has been successfully created.',
  PostList = 'List of posts.',
  PostFound = 'The post found.',
  PostNotFound = 'Post not found.',
  PostUpdated = 'The post has been successfully updated.',
  PostDeleted = 'The post has been successfully deleted.',
  PostCount = 'Count of Users post.',
}

export const SwaggerPaginationProperty = {
  totalPages: { required: false, description: 'total pages' },
  totalItems: { required: false, description: 'total items' },
  currentPage: { required: false, description: 'current page' },
  itemsPerPage: { required: false, description: 'items per page' },
  sortDirection: {
    required: false,
    description: 'direction',
    enum: SortDirection,
  },
};
