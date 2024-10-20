import { IResponse } from "@src/interfaces/response";
import { ICategory } from "../../_interface/category";

export interface ICategoryRepository {
  category: ICategory;
}

export interface IEditCategoryRepository {
  editCategory: IResponse<ICategory>;
}
