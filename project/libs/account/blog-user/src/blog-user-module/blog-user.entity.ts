import { genSalt, hash, compare } from 'bcrypt';
import { Entity } from '@project/core';
import { StorableEntity, AuthUser } from '@project/core';

import { SALT_ROUNDS } from './blog-user.constant';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  public email!: string;
  public name!: string;
  public avatar?: string;
  public passwordHash!: string;
  public registrationDate!: Date;
  public subscriptions: string[];

  constructor(user: AuthUser) {
    super();
    this.populate(user);
  }

  public populate(user?: AuthUser): void {
    if (!user) {
      return;
    }

    this.id = user.id ?? '';
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar ?? '';
    this.passwordHash = user.passwordHash;
    this.registrationDate = user.registrationDate ?? new Date();
    this.subscriptions = user.subscriptions ?? [];
  }

  public toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      passwordHash: this.passwordHash,
      registrationDate: this.registrationDate,
      subscriptions: this.subscriptions,
    };
  }

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  public updateSubscribers(userId: string) {
    const subscriptionsSet = new Set(this.subscriptions);

    if (subscriptionsSet.has(userId)) {
      subscriptionsSet.delete(userId);
    } else {
      subscriptionsSet.add(userId);
    }

    this.subscriptions = Array.from(subscriptionsSet);
  }
}
