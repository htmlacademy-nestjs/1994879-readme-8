import { ApiProperty } from '@nestjs/swagger';
import { UserRDO } from '@project/authentication';
import { Exclude, Expose } from 'class-transformer';
import { AuthSwaggerMessage } from '../authentication-module/authentication.constant';

export class UserDetailedRDO extends UserRDO {
  @Expose()
  @ApiProperty(AuthSwaggerMessage.publicationCount)
  public publicationsCount: number;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.subscriptionsCount)
  subscriptionsCount: number;

  @Exclude()
  public subscriptions: string[];
}
