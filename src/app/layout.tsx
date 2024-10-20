"use client";
import { ApolloProvider } from "@apollo/client";
import { Mulish } from "@next/font/google";
import ToastNotifications from "@src/components/toasts/toast";
import { client } from "@src/lib/client";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["200", "400", "600", "700", "800", "1000", "900"], // Specify the weights you want to use
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
        <ToastNotifications />
      </body>
    </html>
  );
}
