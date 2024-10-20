export interface ILink {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  active?:Boolean | null
}
