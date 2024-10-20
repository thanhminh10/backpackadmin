import { gql } from "@apollo/client";

export const QUERY_CARTS = gql(`
    query Query($pageIndex: Int!, $pageSize: Int!, $sort: Int, $userName: String, $prodName: String) {
        carts(pageIndex: $pageIndex, pageSize: $pageSize, sort: $sort, userName: $userName, prodName: $prodName) {
            success
            message
            data {
                _id
                userId
                prodId
                createdAt
                amount
                product {
                    _id
                    name
                    slug
                    price
                    quantity
                    quantitySold
                    hot
                    description
                    ratingCount
                    linkBuyProductOne
                    linkBuyProductTwo
                    linkBuyProductThree
                    updatedAt
                }
                user {
                    _id
                    userName
                    email
                    phone
                    userLevel
                    avatar
                }
            }
            links {
                totalPages
                totalItems
                pageIndex
                pageSize
            }
        }
    }
`);

export const QUERY_CART = gql(`
    query Query($cartId: String!) {
        cart(cartId: $cartId) {
            _id
            userId
            prodId
            price
            user {
                _id
                userName
                email
                phone
                userLevel
                avatar
            }
            product {
                _id
                name
                slug
                amount
                quantity
                quantitySold
                hot
                description
                ratingCount
                linkBuyProductOne
                linkBuyProductTwo
                linkBuyProductThree
                updatedAt
            }
            createdAt
        }
    }
`);
