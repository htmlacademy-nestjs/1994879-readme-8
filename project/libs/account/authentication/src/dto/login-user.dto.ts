import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import {
  AuthSwaggerMessage,
  PasswordLimit,
} from '../authentication-module/authentication.constant';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ required: true, type: String, ...AuthSwaggerMessage.email })
  public email!: string;

  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String, ...AuthSwaggerMessage.password })
  public password!: string;
}
