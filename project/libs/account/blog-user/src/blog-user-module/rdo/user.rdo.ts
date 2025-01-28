import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerProperty } from '@project/core';

export class UserRDO {
  @Expose()
  @ApiProperty(SwaggerProperty.userId)
  public id: string;

  @Expose()
  @ApiProperty(SwaggerProperty.name)
  public name: string;

  @Expose()
  @ApiProperty(SwaggerProperty.email)
  public email: string;

  @Expose()
  @ApiProperty(SwaggerProperty.avatar)
  public avatar: string;

  @Expose()
  @ApiProperty(SwaggerProperty.registrationDate)
  public registrationDate: string;

  @Expose()
  @ApiProperty(SwaggerProperty.subscribersCount)
  public subscribers: string[];
}
