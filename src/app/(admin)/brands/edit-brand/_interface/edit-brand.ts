import { IResponse } from "@src/interfaces/response";
import { IBrand } from "../../_interface/brand";

export interface IBrandRepository {
  brand: IBrand;
}

export interface IEditBrandRepository {
  editBrand: IResponse<IBrand>;
}
