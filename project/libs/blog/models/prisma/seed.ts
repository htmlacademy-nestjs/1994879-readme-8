import { PostStatus, PostType, PrismaClient } from '@prisma/client';

const getPosts = () => [
  {
    type: PostType.video,
    status: PostStatus.published,
    userId: '67908456a1b5434e7d6e4a9f',
    title: 'Understanding TypeScript',
    description: 'A comprehensive guide to TypeScript.',
    url: 'https://example.com/typescript-guide',
    tags: ['travel', 'health'],
  },
  {
    type: PostType.quote,
    status: PostStatus.draft,
    userId: '67908456a1b5434e7d6e4a9f',
    title: 'My Journey to Fitness',
    description: 'Sharing my fitness journey and tips.',
    text: 'I started my fitness journey a year ago...',
    author: 'Ernesto Maduro',
    tags: ['travel'],
  },
  {
    type: PostType.photo,
    status: PostStatus.published,
    userId: '67991076b894e226d77e7917',
    title: 'Beautiful Sunset',
    url: 'https://example.com/sunset-photo',
  },
];

async function seedDb(prismaClient: PrismaClient) {
  const posts = getPosts();
  for (const post of posts) {
    await prismaClient.post.create({
      data: {
        ...post,
      },
    });
  }

  const [firstPost, secondPost] = await prismaClient.post.findMany({ take: 2 });
  await prismaClient.like.createMany({
    data: [
      {
        userId: '67991076b894e226d77e7917',
        postId: firstPost.id,
      },
      {
        userId: '6761a4c9916464a230378122',
        postId: secondPost.id,
      },
    ],
  });

  await prismaClient.comment.createMany({
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
