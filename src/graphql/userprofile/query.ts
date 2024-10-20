import { gql } from "@apollo/client";

export const QUERY_USER_DETAIL = gql(`
  query User($userId: ID!) {
  user(userId: $userId) {
     _id
    userName
    email
    phone
    userLevel
    avatar
    birthDay
    gender
    password
  }
}
`);
