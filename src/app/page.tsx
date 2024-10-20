"use client";
import { IAccount } from "@src/interfaces/account";
import { appConfig } from "@src/utils/config";
import { AccountLevelType } from "@src/utils/enum/accountLevelTypes";
import { Routers } from "@src/utils/router";
import { decode } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem(appConfig.authToken);
    if (token) {
      handleCheckRedirect(token);
    } else {
      router.push(Routers.auth.pathLogin);
    }

    // Đưa logic bất đồng bộ vào bên trong useEffect
    async function handleCheckRedirect(token: string) {
      const account = ((await decode(token)) as IAccount) ?? "";

      if (account && account.level != AccountLevelType.USER) {
        router.push(Routers.dashboard.pathDashboard);
      }
    }
  }, [router]); // Thêm router vào dependency để tránh lỗi trong môi trường SSR

  return <></>;
}
