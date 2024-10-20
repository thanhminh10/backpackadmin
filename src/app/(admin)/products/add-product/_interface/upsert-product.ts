import { IResponse } from "@src/interfaces/response";
import { IDataProduct } from "../../_interface/product";

export interface ICreateProductResponse {
  createProduct: IResponse<IDataProduct[]>;
}
