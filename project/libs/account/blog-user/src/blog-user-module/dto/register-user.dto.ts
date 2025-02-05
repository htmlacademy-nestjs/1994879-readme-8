import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, Matches, IsEmail } from 'class-validator';
import { SwaggerUserProperty } from '@project/core';
import { PasswordLimit, NameLimit } from '../blog-user.constant';
import 'multer';

export class RegisterUserDTO {
  @IsEmail()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerUserProperty.email)
  public email!: string;

  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerUserProperty.password)
  public password!: string;

  @IsString()
  @Length(NameLimit.Min, NameLimit.Max, { message: NameLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerUserProperty.name)
  public name: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @ApiProperty(SwaggerUserProperty.avatar)
  @Matches(/\.(jpg|png)$/)
  public avatarFile?: Express.Multer.File;
}
