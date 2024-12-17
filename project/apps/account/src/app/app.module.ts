import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/authentication';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@project/app-config';
import { AccountConfigModule, getMongooseOptions } from '@project/account-config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    BlogUserModule,
    AuthenticationModule,
    AccountConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
