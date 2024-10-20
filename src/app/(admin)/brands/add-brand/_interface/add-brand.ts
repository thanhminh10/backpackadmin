import { IResponse } from "@src/interfaces/response";
import { IBrand } from "../../_interface/brand";

export interface ICreateBrandResponse {
  createBrand: IResponse<IBrand>;
}
