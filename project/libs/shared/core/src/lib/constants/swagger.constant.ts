export enum SwaggerTag {
  Auth = 'Authorization routes',
  Blog = 'Blog routes',
  User = 'User routes',
  File = 'File vault',
  Notify = 'Notify service',
  Post = 'Routes for posts',
  Comment = 'Routes for comments',
}

export enum SwaggerOperation {
  Register = 'Register new user',
  GetUsers = 'Get all users (debug only)',
  GetUser = 'Get user info by id',
  ChangePassword = 'Change users password',
  Subscribe = 'Subscribe to user',
  Unsubscribe = 'Unsubscribe from user',
  Login = 'Basic Authorization by login and password',
  RefreshToken = 'Get new pair access, refresh token',
  CheckAuth = 'Validate access token',
  Feed = 'Users feed',
}

export const SwaggerProperty = {
  userId: { description: 'User ID', example: '67990a7d50e42db86a17146b' },
  name: { description: 'User name', example: 'Keks' },
  avatar: { description: 'User avatar', example: 'keks-avatar.png' },
  email: { description: 'Email', example: 'keks-the-cat@gmail.com' },
  password: { description: 'User password', example: '123456' },
  accessToken: { description: 'Access token', example: 'WDwFsqLk...' },
  refreshToken: { description: 'Refresh token', example: 'KxwOSwAs...' },
  registrationDate: { description: 'Registration date', example: '2024-12-12' },
  publicationCount: { description: 'Publication count', example: 0 },
  subscribersCount: { description: 'Subscribers count', example: 4 },
} as const;

export enum SwaggerResponse {
  Unauthorized = 'Unauthorized error',
  BadRequest = 'Bad request error',
  LoggedSuccess = 'User has been successfully logged.',
  LoggedError = 'Password or Login is wrong.',
  UserFound = 'User found',
  UserNotFound = 'User not found',
  UserExist = 'User with the email already exists',
  UserCreated = 'The new user has been successfully created.',
  Updated = 'User password updated',
  RefreshToken = 'Get a new access/refresh tokens',
  Feed = 'Users feed',
}
