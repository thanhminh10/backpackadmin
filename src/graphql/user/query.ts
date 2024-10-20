import { gql } from "@apollo/client";

export const QUERY_USERS = gql(`
    query Users($pageIndex: Int!, $pageSize: Int!, $sort: Int, $searchUser: String, $shopId: String, $userLevel: Int) {
  users(pageIndex: $pageIndex, pageSize: $pageSize, sort: $sort, searchUser: $searchUser, shopId: $shopId, userLevel: $userLevel) {
    data {
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
    links {
      totalPages
      totalItems
      pageIndex
      pageSize
    }
    message
    success
  }
}
`);

export const QUERY_USER = gql(`
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
