import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/core';
import { IsEnum, IsString } from 'class-validator';
import { CreatePostDTO } from './create-post.dto';

export class UpdatePostDTO {
  @IsEnum(PostType)
  @IsString()
  @ApiProperty({ required: true, enum: PostType })
  public type: PostType;
}
