import { IResponse } from "@src/interfaces/response";


export interface IArticleResponse {
  articles: IResponse<IArticle[]>;
}

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  hot: boolean;
  content: string;
  createdAt: string;
  keyword: string;
  posterId:string;
  poster: {
      useName:string;
  }
}

export interface IFormArticle {
  title: string;
  hot: boolean;
  content: string;
  keyword: string;
  file: File | null;
}

export interface IDeleteArticleResponse {
  multiDeleteArticle: IResponse<IArticle>;
}

export interface IAddListArticleResponse {
  createListArticle: IResponse<IArticle>;
}
