import { PageMeta } from './pagination.helper';

export interface PaginatedResult<R> {
  data: R[];
  meta: PageMeta;
}
