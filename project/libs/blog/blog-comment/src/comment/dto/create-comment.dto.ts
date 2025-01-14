import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CommentSwaggerMessage } from '../comment.constant';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, ...CommentSwaggerMessage.message })
  public message: string;

  @IsString()
  @IsMongoId()
  @ApiProperty({ required: true, ...CommentSwaggerMessage.userId })
  public userId: string;
}
