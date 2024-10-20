import { NextResponse, NextRequest } from "next/server";
import { decode } from "jsonwebtoken";
import { IUser } from "./app/(admin)/users/_interface/user";
import { Routers } from "./utils/router";
import { appConfig } from "./utils/config";

export default async function middleware(req: NextRequest, resp: NextResponse) {
  const nextResp = NextResponse;
  let token = resp.headers?.get("Authorization");

  if (typeof window !== "undefined") {
    token = localStorage.getItem(appConfig.authToken) ?? "";
  }
  const account = token ? ((await decode(token)) as IUser) : "";

  if (!token || (account && account.userLevel == 3)) {
    nextResp.redirect(new URL(Routers.auth.pathLogin, req.url));
  }

  return nextResp.next({
    headers: {
      Authorization: token ?? "",
    },
  });
}
