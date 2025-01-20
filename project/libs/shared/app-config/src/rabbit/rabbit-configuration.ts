import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { PortLimit } from '@project/helpers';

export class RabbitConfiguration {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @Min(PortLimit.Min)
  @Max(PortLimit.Max)
  port: number;

  @IsString()
  @IsNotEmpty()
  queue: string;

  @IsString()
  @IsNotEmpty()
  exchange: string;
}
