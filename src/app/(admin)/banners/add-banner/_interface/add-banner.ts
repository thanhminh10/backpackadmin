import { IResponse } from "@src/interfaces/response";
import { IBanner } from "../../_interface/banner";

export interface ICreateBannerResponse {
  createBanner: IResponse<IBanner>;
}
