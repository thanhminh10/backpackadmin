export interface IHeader {
  label: string;
  key: string;
  w?:number;
  center?:boolean;
  left?:boolean;
  right?:boolean;
}

export interface IPagination {
  pageIndex: number;
  pageSize: number;
}
