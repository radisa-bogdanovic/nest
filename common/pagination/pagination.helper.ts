import { DEFAULT_LIMIT } from 'common/pagination/pagination-query.dto';

export interface PrismaPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PageMeta {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function buildPagination(query?: { page?: number; limit?: number }) {
  const page = query?.page ?? 1;
  const limit = query?.limit ?? DEFAULT_LIMIT;
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function buildPage<T>(
  data: T[],
  total: number,
  p: PrismaPagination,
): { data: T[]; meta: PageMeta } {
  const totalPages = total > 0 ? Math.ceil(total / p.limit) : 0;
  return {
    data,
    meta: {
      total,
      page: p.page,
      limit: p.limit,
      totalPages,
      hasNextPage: p.page < totalPages,
      hasPrevPage: p.page > 1,
    },
  };
}
