import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SwaggerUserProperty } from '@project/core';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UserQuery {
  @IsOptional()
  @IsMongoId({ each: true })
  @ApiPropertyOptional({ isArray: true, type: String })
  @ApiProperty(SwaggerUserProperty.userIds)
  userIds?: string[];
}
