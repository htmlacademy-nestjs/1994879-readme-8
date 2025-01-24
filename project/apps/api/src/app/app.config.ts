export enum ApplicationServiceURL {
  Auth = 'http://localhost:3000/api/auth',
  Users = 'http://localhost:3000/api/users',
  Blog = 'http://localhost:4000/api/posts',
  File = 'http://localhost:8000/api/files',
  Notify = 'http://localhost:7000/api',
  Api = 'http://localhost:5000/api',
}

export enum ApiUnit {
  Blog = 'Blog API',
  User = 'User API',
}

export const AvatarLimit = {
  MaxSize: 500000,
  AvailableTypes: /(jpe?g|png)/,
};
