import { IResponse } from "@src/interfaces/response";
import { ICategory } from "../../_interface/category";

export interface ICreateCategoryResponse {
  createCategory: IResponse<ICategory>;
}
