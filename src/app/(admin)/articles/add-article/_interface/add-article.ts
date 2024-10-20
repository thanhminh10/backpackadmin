import { IResponse } from "@src/interfaces/response";
import { IArticle } from "../../_interface/article";

export interface ICreateArticleResponse {
  createArticle: IResponse<IArticle>;
}
