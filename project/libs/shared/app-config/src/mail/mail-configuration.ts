import { PortLimit } from '@project/helpers';
import { IsEmail, IsNumber, IsString, Max, Min } from 'class-validator';

export class MailConfiguration {
  @IsString()
  host: string;

  @IsNumber()
  @Min(PortLimit.Min)
  @Max(PortLimit.Max)
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsEmail()
  from: string;
}
