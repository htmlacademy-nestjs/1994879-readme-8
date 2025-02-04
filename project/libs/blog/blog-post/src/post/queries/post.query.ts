import { IsIn, IsMongoId, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQuery, PostType, SortDirection, SwaggerUserProperty } from '@project/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SortType, PostStatus } from '@project/core';

export class PostQuery extends PaginationQuery {
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ isArray: true, type: String })
  public tags?: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  @ApiPropertyOptional({ isArray: true, type: String })
  @ApiProperty(SwaggerUserProperty.userIds)
  public userIds?: string | string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  @ApiPropertyOptional({ enum: SortDirection })
  public sortDirection?: SortDirection;

  @IsIn(Object.values(SortType))
  @IsOptional()
  @ApiPropertyOptional({ enum: SortType })
  public sortType?: SortType;

  @IsIn(Object.values(PostType))
  @IsOptional()
  @ApiPropertyOptional({ enum: PostType })
  public postType?: PostType;

  @IsIn(Object.values(PostStatus))
  @IsOptional()
  @ApiPropertyOptional({ enum: PostStatus })
  public postStatus?: PostStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  public title?: string;
}
