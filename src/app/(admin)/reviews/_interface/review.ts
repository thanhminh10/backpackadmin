import { IResponse } from "@src/interfaces/response";
import { IImage } from "./image";
import { IUser } from "./user";

export interface IReviewResponse {
  reviews: IResponse<IReviewResponse[]>;
}
// export interface IDeleteReview {
//   multipleDeleteReviews: IResponse<null>;
// }
export interface IReviewResponse {
  _id: string;
  comment: string;
  rating: number;
  active: boolean;
  user: IUser;
  prodId: string;
  images: [IImage];
}

export interface IFormReview {
  comment: string;
  rating: number;
  user: IUser;
}

export interface IToggleReview {
  toggleReview: IResponse<null>;
}

export interface IDataReview {
  review: IReviewResponse;
}
