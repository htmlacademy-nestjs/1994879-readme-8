import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { SortDirection } from '@project/core';
import { PaginationDefaults } from './post.constant';

export class BlogPostQuery {
  @Transform(({ value }) => +value || PaginationDefaults.Limit)
  @IsNumber()
  @IsOptional()
  public limit = PaginationDefaults.Limit;

  @IsUUID('all', { each: true })
  @IsArray()
  @IsOptional()
  public categories?: string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = PaginationDefaults.SortDirection;

  @Transform(({ value }) => +value || PaginationDefaults.PageCount)
  @IsOptional()
  public page: number = PaginationDefaults.PageCount;
}
