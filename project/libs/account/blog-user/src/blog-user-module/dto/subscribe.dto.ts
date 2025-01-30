import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { SwaggerUserProperty } from '@project/core';

export class SubscribeDTO {
  @IsString()
  @IsMongoId()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerUserProperty.userId)
  public userId: string;
}
