import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString()
  @ApiProperty({ required: true, type: String, example: 'user@notfound.local' })
  public email!: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ required: true, type: String, example: 'Passwod_123' })
  public password!: string;
}
