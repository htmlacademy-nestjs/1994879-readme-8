import { PaginationResult } from '@project/core';

export function calculateSkipItems(page: number, limit: number) {
  return page && limit ? (page - 1) * limit : undefined;
}

export function calculateItemsPerPage(totalCount: number, limit: number): number {
  return Math.ceil(totalCount / limit);
}

export function createPaginationResponse<T>(
  entities: T[],
  count: number,
  take: number,
  currentPage: number | undefined
): PaginationResult<T> {
  return {
    currentPage,
    totalPages: calculateItemsPerPage(count, take),
    itemsPerPage: take,
    totalItems: count,
    entities,
  };
}
