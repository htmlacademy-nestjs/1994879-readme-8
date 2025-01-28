import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { SwaggerProperty } from '@project/core';

export class SubscribeDTO {
  @IsString()
  @IsMongoId()
  @ApiProperty({ required: true })
  @ApiProperty(SwaggerProperty.userId)
  public userId: string;
}
