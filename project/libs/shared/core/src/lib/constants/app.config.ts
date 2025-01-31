export const USER_ID_HEADER = Symbol('x-user-id');
export const APP_PREFIX = 'api';
export const DEFAULT_AVATAR = 'default-avatar.png';

export const AppHeader = {
  UserId: typeof USER_ID_HEADER === 'symbol' ? USER_ID_HEADER.description : USER_ID_HEADER,
  Auth: 'authorization',
};

export enum AppRoute {
  Auth = 'auth',
  User = 'users',
  Post = 'posts',
  File = 'files',
  Comment = 'comments',
  Blog = 'blog',
  Password = 'password',
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
  Refresh = 'refresh',
  Check = 'check',
  Register = 'register',
  Login = 'login',
  Upload = 'upload',
  Static = 'static',
  Feed = 'feed',
  Count = 'count',
  Like = 'likes',
  Notify = 'notify',
  PostId = 'postId',
  CommentId = 'commentId',
  PostComment = `${AppRoute.Post}/:${AppRoute.PostId}/${AppRoute.Comment}`,
}
