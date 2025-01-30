import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerUserProperty, SwaggerPostProperty } from '@project/core';

export class LikeDTO {
  @IsString()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerPostProperty.postId)
  postId: string;

  @IsString()
  @IsMongoId()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerUserProperty.userId)
  userId: string;
}
