import { IsString } from 'class-validator';

export class NotifyNewPostDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  author: string;
}
