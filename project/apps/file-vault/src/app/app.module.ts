import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig, getMongooseOptions } from '@project/app-config';
import { FileUploaderModule } from '@project/file-uploader';
import { FileVaultConfigModule } from '@project/file-vault-config';
import { RequestLoggerInterceptor } from '@project/interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    FileUploaderModule,
    FileVaultConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule {}
