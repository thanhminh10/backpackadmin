import { IImage } from "@src/interfaces/image";
import { IResponse } from "@src/interfaces/response";

export interface ICategoryResponse {
  categories: IResponse<ICategory[]>;
}

export interface IProductofCate {
  _id: string;
  name: string;
}

export interface ICategory {
  _id: string;
  name: string;
  isActive: boolean;
  logo: string | null;
  icon?: string;
  products?: IProductofCate[];
}

export interface IFormCategory {
  name: string;
  isActive: boolean;
  file?: File;
  note?: string;
  des?: string;
}

export interface IDeleteCategoryResponse {
  multipleDeleteCategories: IResponse<null>;
}

export interface IUploadSingleImageResponse {
  uploadSingleImage: IResponse<IImage[]>;
}
