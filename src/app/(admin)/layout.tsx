"use client";
import Navbar from "@src/components/layouts/navbar";
import Sidebar from "@src/components/layouts/sidebar";
import { appConfig } from "@src/utils/config";
import { decode, JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

interface User {
  id: string;
  userName: string;
  level: number;
  iat: number;
  exp: number;
}

export default function LayoutMainPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null); // Use the User type here
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(appConfig.authToken);
    if (!storedToken) {
      redirect("/login");
    } else {
      setToken(storedToken);
      const decodedUser = decode(storedToken) as JwtPayload | null; // Explicitly type cast to JwtPayload or null

      if (decodedUser && typeof decodedUser !== "string") {
        // Assuming JwtPayload has the user properties, cast to User type
        setUser(decodedUser as User);
      } else {
        setUser(null);
      }
    }
  }, []);
  return (
    <div className="relative h-full bg-content-bg flex">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar
          user={user || { id: "", userName: "", level: 0, iat: 0, exp: 0 }}
        />
        <Suspense>
          <div className="flex-1 mx-[72px] w-full">{children}</div>
        </Suspense>
      </div>
    </div>
  );
}
