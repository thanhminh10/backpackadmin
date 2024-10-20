export interface IResponse<T> {
  links?: ILink;
  message?: string;
  success?: boolean;
  data: T | null;
}

interface ILink {
  totalPages?: number;
  totalItems?: number;
  pageIndex?: number;
  pageSize?: number;
}
