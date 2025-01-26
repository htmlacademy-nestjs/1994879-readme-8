import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AuthSwaggerMessage } from '../authentication-module/authentication.constant';

export class LoggedUserRDO {
  @Expose()
  @ApiProperty(AuthSwaggerMessage.accessToken)
  public accessToken: string;

  @Expose()
  @ApiProperty(AuthSwaggerMessage.refreshToken)
  public refreshToken: string;
}
