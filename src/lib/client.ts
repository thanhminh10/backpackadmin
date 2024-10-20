import { ApolloClient, InMemoryCache } from "@apollo/client";
import { appConfig } from "@src/utils/config";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

let token = null;

if (typeof window !== "undefined") {
  // Perform localStorage action
  token = localStorage.getItem(appConfig.authToken);
}

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: appConfig.uri,
    headers: {
      Authorization: token ?? "",
      "Apollo-Require-Preflight": "true",
    },
  }),
});
