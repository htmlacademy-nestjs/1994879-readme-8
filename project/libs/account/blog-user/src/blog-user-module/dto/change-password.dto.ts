import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { SwaggerProperty } from '@project/core';
import { PasswordLimit } from '../blog-user.constant';

export class ChangePasswordDTO {
  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.password)
  public password!: string;

  @IsString()
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: PasswordLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(SwaggerProperty.password)
  public newPassword!: string;
}
