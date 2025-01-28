import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { NameLimit, PasswordLimit } from '../blog-user.constant';
import { SwaggerProperty } from '@project/core';

export class CreateUserDTO {
  @IsEmail()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.email)
  public email!: string;

  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.password)
  public password!: string;

  @IsString()
  @Length(NameLimit.Min, NameLimit.Max, { message: NameLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.name)
  public name: string;

  @IsString()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.avatar)
  public avatar: string;
}
