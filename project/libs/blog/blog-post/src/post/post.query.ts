import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { SortDirection } from '@project/core';
import { PaginationDefaults } from './post.constant';

export class PostQuery {
  @Transform(({ value }) => +value || PaginationDefaults.Limit)
  @IsNumber()
  @IsOptional()
  public limit = PaginationDefaults.Limit;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public tags?: string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = PaginationDefaults.SortDirection;

  @Transform(({ value }) => +value || PaginationDefaults.PageCount)
  @IsOptional()
  public page: number = PaginationDefaults.PageCount;
}
