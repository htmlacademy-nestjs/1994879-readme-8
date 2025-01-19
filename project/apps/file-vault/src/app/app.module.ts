import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig, getMongooseOptions } from '@project/app-config';
import { FileUploaderModule } from '@project/file-uploader';
import { FileVaultConfigModule } from '@project/file-vault-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    FileUploaderModule,
    FileVaultConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
})
export class AppModule {}
