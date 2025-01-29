import { Subscriber } from '../types/subscriber.interface';
export const APP_PREFIX = 'api';
export const DEFAULT_AVATAR = 'default-avatar.png';

export enum AppRoute {
  Auth = 'auth',
  User = 'users',
  Post = 'post',
  File = 'files',
  Comment = 'comment',
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
}
