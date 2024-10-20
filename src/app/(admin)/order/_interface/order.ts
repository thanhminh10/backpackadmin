import { IResponse } from "@src/interfaces/response";
import { IOrderItem } from "./order-item";
import { IUser } from "./user";

export interface IOrdersResponse {
  orders: IResponse<IDataOrders[]>;
}

export interface IOrderResponse {
  order: IDataOrders;
}

export interface IDataOrders {
  _id: string;
  user: IUser;
  orderItem: [IOrderItem];
  deliveryAddress: string;
  paymentMethod: number;
  quantity: number;
  subTotal: number;
  userName: string;
  userPhone: string;
  prodId: string;
  userId: string;
  createdAt: string;
}
