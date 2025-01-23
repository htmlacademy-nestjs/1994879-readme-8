import { IsString } from 'class-validator';

export class NotifyNewPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  author: string;
}
