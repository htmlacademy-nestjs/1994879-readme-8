import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsMongoId, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQuery, SortDirection, SwaggerUserProperty } from '@project/core';
import { PaginationDefaults, PostSwaggerQuery } from './post.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostQuery extends PaginationQuery {
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ isArray: true, type: String })
  public tags?: string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  @ApiPropertyOptional({ enum: SortDirection, default: PaginationDefaults.SortDirection })
  public sortDirection?: SortDirection = PaginationDefaults.SortDirection;

  @IsOptional()
  @IsMongoId({ each: true })
  @ApiPropertyOptional({ isArray: true, type: String })
  @ApiProperty(SwaggerUserProperty.userIds)
  public userIds?: string[];
}
