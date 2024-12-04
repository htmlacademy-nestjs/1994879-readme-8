import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from './login-user.dto';
import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class CreateUserDto extends LoginUserDto {
  @IsString()
  @Length(3, 50)
  @ApiProperty({ required: true, type: String })
  public name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: true, type: String })
  @Matches(/\.(jpg|png)$/)
  public avatar?: string;
}
