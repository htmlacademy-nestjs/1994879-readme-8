import { ApiProperty } from '@nestjs/swagger';
import { UserRDO } from './user.rdo';
import { Exclude, Expose } from 'class-transformer';
import { SwaggerProperty } from '@project/core';

export class UserDetailedRDO extends UserRDO {
  @Expose()
  @ApiProperty(SwaggerProperty.publicationCount)
  public publicationsCount: number;

  @Expose()
  @ApiProperty(SwaggerProperty.subscribersCount)
  subscribersCount: number;

  @Exclude()
  public subscribers: string[];
}
