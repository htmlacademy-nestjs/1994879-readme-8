import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SwaggerProperty } from '@project/core';

export class LoggedUserRDO {
  @Expose()
  @ApiProperty(SwaggerProperty.accessToken)
  public accessToken: string;

  @Expose()
  @ApiProperty(SwaggerProperty.refreshToken)
  public refreshToken: string;
}
