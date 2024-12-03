import { Module } from '@nestjs/common';

import { BlogUserRepository } from './blog-user.repository';
import { BlogUserFactory } from './blog-user.factory';
import { BlogUserController } from './blog-user.controller';

@Module({
  providers: [BlogUserRepository, BlogUserFactory],
  controllers: [BlogUserController],
  exports: [BlogUserRepository],
})
export class BlogUserModule {}
