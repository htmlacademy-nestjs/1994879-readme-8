import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDTO } from './login-user.dto';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { AuthSwaggerMessage, NameLimit } from '../authentication-module/authentication.constant';

export class CreateUserDTO extends LoginUserDTO {
  @IsString()
  @Length(NameLimit.Min, NameLimit.Max, { message: NameLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(AuthSwaggerMessage.name)
  public name: string;

  @IsString()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(AuthSwaggerMessage.avatar)
  public avatar?: string;
}
