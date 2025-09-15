export interface PaginationQueryDto {
  page: number;
  perPage: number;
  search?: string;
}

export interface PaginatedMeta {
  page: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T = any> {
  data: T[];
  meta: PaginatedMeta;
}
