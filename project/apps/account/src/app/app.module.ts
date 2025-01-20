import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationModule } from '@project/authentication';
import { ConfigModule } from '@nestjs/config';
import { appConfig, getMongooseOptions } from '@project/app-config';
import { AccountConfigModule } from '@project/account-config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyModule } from '@project/account-notify';

@Module({
  imports: [
    BlogUserModule,
    AuthenticationModule,
    AccountConfigModule,
    NotifyModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
