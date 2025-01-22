import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from './login-user.dto';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { AuthSwaggerMessage, NameLimit } from '../authentication-module/authentication.constant';

export class CreateUserDto extends LoginUserDto {
  @IsString()
  @Length(NameLimit.Min, NameLimit.Max, { message: NameLimit.Description })
  @ApiProperty({ required: true, type: String })
  @ApiProperty(AuthSwaggerMessage.name)
  public name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: true, type: String })
  @ApiProperty(AuthSwaggerMessage.avatar)
  @Matches(/\.(jpg|png)$/)
  public avatar?: string;
}
