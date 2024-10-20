import { IResponse } from "@src/interfaces/response";

export interface IUser {
  _id: string;
  userName: string;
  email?: string;
  phone?: string;
  password: string;
  userLevel: number;
  avatar?: string;
  birthDay?: string;
  gender?: string;
  note?: string;
  address?: {
    province: string;
    district: string;
    ward: string;
    detailedAddress?: string;
  };
}

export interface IUserDetailResponse {
  user: IUser;
}

export interface IUsersResponse {
  users: IResponse<IUser[]>;
}

export interface IDeleteUser {
  deleteUser: IResponse<null>;
}

export interface IFormUser {
  email?: string;
  phone?: string;
  userName: string;
  userLevel: number;
  password?: string;
  avatar?: string;
  birthDay?: string;
  gender?: string;
  note?: string;
  address?: {
    province: string;
    district: string;
    ward: string;
    detailedAddress?: string;
  };
}
