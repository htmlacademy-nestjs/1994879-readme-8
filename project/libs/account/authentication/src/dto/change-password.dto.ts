import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import {
  AuthSwaggerMessage,
  PasswordLimit,
} from '../authentication-module/authentication.constant';

export class ChangePasswordDto {
  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String, ...AuthSwaggerMessage.password })
  public password!: string;

  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String, ...AuthSwaggerMessage.password })
  public newPassword!: string;
}
