import { IResponse } from "@src/interfaces/response";
import { IUser } from "../../_interface/user";

export interface IDetailUserResponse {
  user: IUser;
}

export interface IEditUserResponse {
  editProfileUser: IResponse<IUser[]>;
}
