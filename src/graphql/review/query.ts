import { gql } from "@apollo/client";

export const QUERY_REVIEWS = gql`
  query Query(
    $pageSize: Int!
    $pageIndex: Int!
    $sort: Int
    $prodName: String
    $userName: String
  ) {
    reviews(
      pageSize: $pageSize
      pageIndex: $pageIndex
      sort: $sort
      prodName: $prodName
      userName: $userName
    ) {
      success
      message
      links {
        totalPages
        totalItems
        pageIndex
        pageSize
      }
      data {
        _id
        comment
        rating
        user {
          _id
          userName
          email
          phone
          userLevel
          avatar
        }
        active
        images {
          _id
          name
          url
        }
        prodId
      }
    }
  }
`;

export const QUERY_REVIEW = gql(`
  query Review($reviewId: ID!) {
  review(reviewId: $reviewId) {
    _id
    active
    comment
    createdAt
    images {
      _id
      name
      url
      prodId
      reviewId
      products {
        _id
        name
        slug
        sku
        price
        quantity
        quantitySold
        hot
        description
        ratingCount
        keyword
        cateId
        brandId
        image {
          _id
          name
          url
          prodId
          reviewId
        }
        linkBuyProductOne
        linkBuyProductTwo
        linkBuyProductThree
        updatedAt
        category {
          _id
          name
          isActive
          logo
          icon
        }
        brand {
          _id
          name
          logo
          isActive
        }
        review {
          _id
          comment
          rating
          user {
            _id
            userName
            email
            phone
            userLevel
            avatar
            
          }
          active
          images {
            _id
            name
            url
            prodId
            reviewId
          }
          prodId
          createdAt
        }
        isActive
      }
    }
    prodId
    rating
    user {
      _id
      userName
      email
      phone
      userLevel
      avatar
    }
  }
}
`);
