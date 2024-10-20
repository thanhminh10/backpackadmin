import { gql } from "@apollo/client";

export const QUERY_ORDERS = gql(`
    query Orders($pageIndex: Int!, $pageSize: Int!, $sort: Int, $userName: String) {
        orders(
            pageIndex: $pageIndex
            pageSize: $pageSize
            sort: $sort
            userName: $userName
        ) {
            links {
                totalPages
                totalItems
                pageIndex
                pageSize
            }
            success
            message
            data {
                _id
                subTotal
                quantity
                paymentMethod
                deliveryAddress
                userName
                userPhone
                userId
                user {
                    _id
                    userName
                    email
                    phone
                    userLevel
                    avatar
                }
                orderItem {
                    _id
                    name
                    price
                    itemQuantity
                    orderId
                    createdAt
                    thumbnail
                }
                createdAt
            }
        }
    }
`);

export const QUERY_ORDER = gql(`
    query Order($orderId: String!) {
  order(orderId: $orderId) {
    _id
    subTotal
    quantity
    paymentMethod
    deliveryAddress
    userName
    userPhone
    userId
    user {
      _id
      userName
      email
      phone
      userLevel
      avatar
    }
    orderItem {
      _id
      name
      price
      itemQuantity
      thumbnail
      orderId
      createdAt
    }
    createdAt
  }
}
`);
