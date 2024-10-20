import { IResponse } from "@src/interfaces/response";
import { IDataProduct } from "../../_interface/product";

export interface IDetailProductResponse {
  product: IResponse<IDataProduct>;
}

export interface IEditProductResponse {
  editProduct: IResponse<IDataProduct>;
}
