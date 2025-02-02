import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { SortDirection } from '../types/sort-direction.enum';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerPaginationProperty } from '../constants/swagger.constant';

export class PaginationQuery {
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @ApiProperty(SwaggerPaginationProperty.itemsPerPage)
  public limit?: number;

  // @IsIn(Object.values(SortDirection))
  // @IsOptional()
  // @ApiProperty(SwaggerPaginationProperty.sortDirection)
  // public sortDirection?: SortDirection;

  @Transform(({ value }) => +value)
  @IsOptional()
  @ApiProperty(SwaggerPaginationProperty.currentPage)
  public page?: number;
}
