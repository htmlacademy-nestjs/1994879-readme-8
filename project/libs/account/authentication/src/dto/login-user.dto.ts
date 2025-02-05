import { ApiProperty } from '@nestjs/swagger';
import { SwaggerUserProperty } from '@project/core';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerUserProperty.email)
  public email!: string;

  @IsString()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerUserProperty.password)
  public password!: string;
}
