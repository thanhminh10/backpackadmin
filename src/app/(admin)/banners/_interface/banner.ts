import { IResponse } from "@src/interfaces/response";
import { ICategory } from "./category";

export interface IBannerResponse {
  banners: IBanner[];
}

export interface IBanner {
  _id: string;
  title: string;
  url: string;
  imageUrl?: string;
  category?: ICategory;
  isActive?: boolean;
  cateId?: string;
}

export interface IFormBanner {
  title: string;
  url: string;
  file: File | null;
  cateId: string;
  isActive: boolean;
  note?:string;
}

export interface IDeleteBannerResponse {
  deleteBanner: IResponse<IBanner>;
}
