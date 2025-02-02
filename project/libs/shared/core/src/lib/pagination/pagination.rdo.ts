import { Expose, Type } from 'class-transformer';
import { PaginationResult } from '../interfaces/pagination.interface';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerPaginationProperty } from '../constants/swagger.constant';

export class PaginationRDO<T> implements PaginationResult<T> {
  @Expose()
  @ApiProperty(SwaggerPaginationProperty.totalPages)
  public totalPages: number;

  @Expose()
  @ApiProperty(SwaggerPaginationProperty.totalItems)
  public totalItems: number;

  @Expose()
  @ApiProperty(SwaggerPaginationProperty.currentPage)
  public currentPage: number;

  @Expose()
  @ApiProperty(SwaggerPaginationProperty.itemsPerPage)
  public itemsPerPage: number;

  @Expose()
  entities: T[];
}
