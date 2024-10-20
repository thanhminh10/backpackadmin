import { IResponse } from "@src/interfaces/response";

export interface IUploadImageResponse {
  uploadImage: IResponse<IData[]>;
}

export interface IImagesResponse {
  images: IData[];
}

export interface IDeleteImagesResponse {
  deleteImage: IResponse<null>;
}

interface IData {
  _id: string;
  name: string;
  url: string;
  prodId: string;
}
