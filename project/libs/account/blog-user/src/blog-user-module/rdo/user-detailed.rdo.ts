import { ApiProperty } from '@nestjs/swagger';
import { UserRDO } from './user.rdo';
import { Exclude, Expose } from 'class-transformer';
import { SwaggerUserProperty } from '@project/core';

export class UserDetailedRDO extends UserRDO {
  @Expose()
  @ApiProperty(SwaggerUserProperty.publicationCount)
  public publicationsCount: number;

  @Expose()
  @ApiProperty(SwaggerUserProperty.subscribersCount)
  subscribersCount: number;

  @Exclude()
  public subscribers: string[];
}
