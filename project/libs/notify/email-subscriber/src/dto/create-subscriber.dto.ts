import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDTO {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public name: string;
}
