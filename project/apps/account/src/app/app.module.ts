import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/authentication';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';

@Module({
  imports: [
    BlogUserModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
