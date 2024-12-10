import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AuthSwaggerMessage } from '../authentication-module/authentication.constant';

export class LoggedUserRDO {
  @Expose()
  @ApiProperty({ ...AuthSwaggerMessage.id })
  public id: string;

  @Expose()
  @ApiProperty({ ...AuthSwaggerMessage.email })
  public email: string;

  @Expose()
  @ApiProperty({ ...AuthSwaggerMessage.accessToken })
  public accessToken: string;
}
