import { PostStatus, PostType, PrismaClient } from '@prisma/client';
import { Comment } from '../../../shared/core/src/lib/types/comment.interface';

const getTags = () => [
  { name: 'Technology' },
  { name: 'Health' },
  { name: 'Lifestyle' },
  { name: 'Education' },
  { name: 'Travel' },
];

const getPosts = () => [
  {
    type: PostType.Video,
    status: PostStatus.Published,
    userId: 'user1',
    title: 'Understanding TypeScript',
    description: 'A comprehensive guide to TypeScript.',
    url: 'https://example.com/typescript-guide',
    text: 'TypeScript is a typed superset of JavaScript...',
    authorId: 'author1',
  },
  {
    type: PostType.Text,
    status: PostStatus.Draft,
    userId: 'user2',
    title: 'My Journey to Fitness',
    description: 'Sharing my fitness journey and tips.',
    text: 'I started my fitness journey a year ago...',
    authorId: 'author2',
  },
  {
    type: PostType.Photo,
    status: PostStatus.Published,
    userId: 'user3',
    title: 'Beautiful Sunset',
    description: 'Captured this beautiful sunset during my trip.',
    url: 'https://example.com/sunset-photo',
    authorId: 'author3',
  },
];

async function seedDb(prismaClient: PrismaClient) {
  const tags = getTags();
  await prismaClient.tag.createMany({ data: tags, skipDuplicates: true });

  const posts = getPosts();
  await prismaClient.post.createMany({
    data: posts,
  });

  const [firstPost, secondPost] = await prismaClient.post.findMany({ take: 2 });
  await prismaClient.favorite.createMany({
    data: [
      {
        userId: 'user4',
        postId: firstPost.id,
      },
      {
        userId: 'user5',
        postId: secondPost.id,
      },
    ],
  });

  const comments = await prismaClient.comment.createMany({
    data: [
      {
        message: 'Great post! Very informative.',
        userId: 'user4',
        postId: firstPost.id,
      },
      {
        message: 'Thanks for sharing your journey!',
        userId: 'user5',
        postId: firstPost.id,
      },
    ],
  });

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
