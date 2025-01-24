import { Expose } from 'class-transformer';
import { AuthSwaggerMessage } from '../authentication-module/authentication.constant';
import { ApiProperty } from '@nestjs/swagger';

export class UserRDO {
  @Expose()
  @ApiProperty(AuthSwaggerMessage.id)
  public id: string;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.name)
  public name: string;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.email)
  public email: string;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.avatar)
  public avatar: string;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.registrationDate)
  public registrationDate: string;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.subscriptionsCount)
  public subscriptions: string[];
}
