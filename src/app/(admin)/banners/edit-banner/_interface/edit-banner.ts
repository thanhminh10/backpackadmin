import { IResponse } from "@src/interfaces/response";
import { IBanner } from "../../_interface/banner";

export interface IBannerRepository {
  banner: IBanner;
}

export interface IEditBannerRepository {
  editBanner: IResponse<IBanner>;
}
