import { IImage } from "@src/interfaces/image";
import { IResponse } from "@src/interfaces/response";
import { ICategory } from "../../banners/_interface/category";
import { IBrand } from "../../brands/_interface/brand";

export interface IProductResponse {
  products: IResponse<IDataProduct[]>;
}

export interface IDeleteProducts {
  multipleDeleteProduct: IResponse<null>;
}

export interface IDeleteProductbyId {
  deleteProduct: IResponse<null>;
}

export interface IDataProduct {
  _id: string;
  cateId?: string;
  brandId?: string;
  description: string;
  sku?:string;
  hot: boolean;
  linkBuyProductOne?: string;
  linkBuyProductThree?: string;
  linkBuyProductTwo?: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  quantitySold: number;
  ratingCount: string;
  updatedAt: string;
  keyword?: string;
  image: IImage[];
  isActive?: boolean;
  category?:ICategory;
  brand?:IBrand;
}

export interface IFormProduct {
  name: string;
  slug?: string;
  price: number;
  sku?:string;
  quantity?: number;
  quantitySold?: number;
  hot?: Boolean;
  description?: string;
  keyword?: string;
  cateId?: string;
  brandId?: string;
  linkBuyProductOne?: string;
  linkBuyProductTwo?: string;
  linkBuyProductThree?: string;
  isActive?: boolean;
}
