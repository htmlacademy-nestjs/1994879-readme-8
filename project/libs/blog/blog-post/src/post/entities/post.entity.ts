import { Entity, PostStatus, PostType } from '@project/core';
import { StorableEntity, Post } from '@project/core';

export class PostEntity extends Entity implements StorableEntity<Post> {
  type: PostType;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title?: string;
  description?: string;
  url?: string;
  text?: string;
  comments: Comment[];
  favorites: string[];
  isRepost: boolean;
  originalId: string;
  originalUserId: string;

  tags?: string[];

  // id          String     @id @default(cuid())
  // type        PostType
  // status      PostStatus
  // createdAt   DateTime   @default(now()) @map("created_at")
  // updatedAt   DateTime   @updatedAt @map("updated_at")
  // userId      String     @map("user_id")
  // title       String?
  // description String?
  // url         String?
  // text        String?
  // authorId    String?    @map("author_id")

  // repostId String? @map("repost_id")
  // repost   Post?   @relation("repost", fields: [repostId], references: [id])

  // tags      Tag[]
  // comments  Comment[]
  // favorites Favorite[]

  constructor(post: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = user.id ?? '';
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar ?? '';
    this.passwordHash = user.passwordHash;
  }

  public toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      passwordHash: this.passwordHash,
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
}
