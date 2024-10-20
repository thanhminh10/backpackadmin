import { IResponse } from "@src/interfaces/response";

export interface ILoginResponse {
  login: IResponse<IToken>;
}

interface IToken {
  token: string;
}
