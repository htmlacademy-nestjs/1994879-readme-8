import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SwaggerCommentProperty, SwaggerPostProperty } from '@project/core';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerCommentProperty.message)
  public message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerPostProperty.postId)
  public postId: string;
}
