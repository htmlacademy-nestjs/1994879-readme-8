export enum AuthMessage {
  Exists = 'User with this email exists',
  NotFound = 'User not found',
  WrongPassword = 'User password is wrong',
  JWTCreateError = 'Jwt token error',
}

export enum AuthResponseDescription {
  LoggedSuccess = 'User has been successfully logged.',
  LoggedError = 'Password or Login is wrong.',
  UserFound = 'User found',
  UserNotFound = 'User not found',
  UserExist = 'User with the email already exists',
  UserCreated = 'The new user has been successfully created.',
  RefreshToken = 'Get a new access/refresh tokens',
}

export const AuthSwaggerMessage = {
  id: { description: 'User ID', example: '3d11998b-f67f-480e-98ad-03bad6a22b64' },
  name: { description: 'User name', example: 'Keks' },
  avatar: { description: 'User avatar', example: 'keks-avatar.png' },
  email: { description: 'Email', example: 'keks-the-cat@gmail.com' },
  password: { description: 'User password', example: '123456' },
  accessToken: { description: 'Access token', example: 'WDwFsqLk...' },
  refreshToken: { description: 'Refresh token', example: 'KxwOSwAs...' },
  registrationDate: { description: 'Registration date', example: '2024-12-12' },
  publicationCount: { description: 'Publication count', example: 0 },
  followersCount: { description: 'Followers count', example: 4 },
} as const;

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
