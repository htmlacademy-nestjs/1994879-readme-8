import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { SortDirection } from '@project/core';
import { PaginationDefaults, PostSwaggerQuery } from './post.constant';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PostQuery {
  @Transform(({ value }) => +value || PaginationDefaults.Limit)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    default: PaginationDefaults.Limit,
    description: PostSwaggerQuery.limit.description,
  })
  public limit? = PaginationDefaults.Limit;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ isArray: true, type: String })
  public tags?: string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  @ApiPropertyOptional({ enum: SortDirection, default: PaginationDefaults.SortDirection })
  public sortDirection?: SortDirection = PaginationDefaults.SortDirection;

  @Transform(({ value }) => +value || PaginationDefaults.PageCount)
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    default: PaginationDefaults.PageCount,
    description: PostSwaggerQuery.page.description,
  })
  public page?: number = PaginationDefaults.PageCount;

  @IsOptional()
  @IsArray()
  public userIds?: string[];
}
