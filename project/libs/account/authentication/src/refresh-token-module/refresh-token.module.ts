import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenModel, RefreshTokenSchema } from './refresh-token.model';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshTokenFactory } from './refresh-token.factory';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RefreshTokenModel.name, schema: RefreshTokenSchema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [RefreshTokenService, RefreshTokenRepository, RefreshTokenFactory],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
