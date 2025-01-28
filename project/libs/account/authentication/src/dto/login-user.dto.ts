import { ApiProperty } from '@nestjs/swagger';
import { SwaggerProperty } from '@project/core';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.email)
  public email!: string;

  @IsString()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.password)
  public password!: string;
}
