import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6, 12)
  @ApiProperty({ required: true, example: '123456' })
  public password!: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ required: true, example: '654321' })
  public newPassword!: string;
}
