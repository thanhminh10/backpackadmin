import { IResponse } from "@src/interfaces/response";

export interface IBrandResponse {
  brands: IResponse<IBrand[]>;
}

export interface IProductofBrand {
  _id:string;
  name:string;
}

export interface IBrand {
  _id: string;
  name: string;
  isActive: boolean;
  logo?: string | null;
  products?: IProductofBrand[]
  note?:string;
  des?:string;
}

export interface IFormBrand {
  name: string;
  isActive: boolean;
  logo?: File;
  note?:string;
  des?:string;
}

export interface IDeleteBrandResponse {
  multipleDeleteBrand: IResponse<null>;
}
