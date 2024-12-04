import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6, 12)
  @ApiProperty({ required: true })
  public password!: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ required: true })
  public newPassword!: string;
}
