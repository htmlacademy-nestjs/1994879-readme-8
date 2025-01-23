export enum ApplicationServiceURL {
  Users = 'http://localhost:3000/api/auth',
  Blog = 'http://localhost:4000/api/posts',
  File = 'http://localhost:8000/api/files',
  Notify = 'http://localhost:7000/api',
  Api = 'http://localhost:5000/api',
}

export enum ApiUnit {
  Post = 'Post API',
  Like = 'Like API',
  Comment = 'Comment API',
  User = 'User API',
}

export const AvatarLimit = {
  MaxSize: 500000,
  AvailableTypes: /(jpe?g|png)/,
};
