import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerUserProperty } from '@project/core';

export class UserRDO {
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

  @Expose()
  @ApiProperty(SwaggerUserProperty.registrationDate)
  public registrationDate: string;

  @Expose()
  @ApiProperty(SwaggerUserProperty.subscribersCount)
  public subscribers: string[];
}
