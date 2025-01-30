import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SwaggerUserProperty } from '@project/core';

export class LoggedUserRDO {
  @Expose()
  @ApiProperty(SwaggerUserProperty.accessToken)
  public accessToken: string;

  @Expose()
  @ApiProperty(SwaggerUserProperty.refreshToken)
  public refreshToken: string;
}
