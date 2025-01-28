import { BadRequestException } from '@nestjs/common';
export const SALT_ROUNDS = 10;

export enum UserMessage {
  Exists = 'User with this email exists',
  NotFound = 'User not found',
  WrongPassword = 'User password is wrong',
  IdenticalPassword = 'identical passwords are not allowed',
  SubscribeLoop = 'You cannot subscribe to yourself.',
  SubscriptFound = 'Subscription already exists.',
  SubscriptNotFound = 'Subscription not found.',
}

export enum ResponseDescription {
  UserFound = 'User found',
  UserNotFound = 'User not found',
  UserExist = 'User with the email already exists',
  UserCreated = 'The new user has been successfully created.',
  Updated = 'User password updated',
  BadRequest = 'Bad request',
  Subscribed = 'User subscribed successfully.',
  Unsubscribed = 'User unsubscribed successfully.',
}

export const NameLimit = {
  Min: 3,
  Max: 50,
  Description: 'User name must be between 3 and 50 characters',
} as const;

export const PasswordLimit = {
  Min: 6,
  Max: 12,
  Description: 'Password name must be between 6 and 12 characters',
} as const;
