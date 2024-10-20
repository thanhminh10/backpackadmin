import { IResponse } from "@src/interfaces/response";
import { IArticle } from "../../_interface/article";

export interface IArticleRepository {
  article: IResponse<IArticle>;
}

export interface IEditArticleRepository {
  editArticle: IResponse<IArticle>;
}
