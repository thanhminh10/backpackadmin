import { IResponse } from "@src/interfaces/response";
import { IUser } from "../../_interface/user";

export interface IAddUserResponse {
  register: IResponse<IUser[]>;
}
