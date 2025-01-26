import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDTO } from './login-user.dto';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { AuthSwaggerMessage, NameLimit } from '../authentication-module/authentication.constant';
import 'multer';

export class RegisterUserDTO extends LoginUserDTO {
  @IsString()
  @Length(NameLimit.Min, NameLimit.Max, { message: NameLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(AuthSwaggerMessage.name)
  public name: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @ApiProperty(AuthSwaggerMessage.avatar)
  @Matches(/\.(jpg|png)$/)
  public avatarFile?: Express.Multer.File;
}
