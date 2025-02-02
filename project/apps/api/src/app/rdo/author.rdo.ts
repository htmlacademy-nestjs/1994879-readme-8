import { ApiProperty } from '@nestjs/swagger';
import { SwaggerUserProperty } from '@project/core';
import { Expose } from 'class-transformer';

export class AuthorRDO {
  @Expose()
  @ApiProperty(SwaggerUserProperty.userId)
  public id: string;

  @Expose()
  @ApiProperty(SwaggerUserProperty.name)
  public name: string;

  @Expose()
  @ApiProperty(SwaggerUserProperty.email)
  public email: string;

  @Expose()
  @ApiProperty(SwaggerUserProperty.avatar)
  public avatar: string;
}
