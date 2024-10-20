import { gql } from "@apollo/client";

export const QUERY_PRODUCTS = gql`
  query Products(
    $pageIndex: Int
    $prodName: String
    $pageSize: Int
    $sort: Int
    $active: Boolean
  ) {
    products(
      pageIndex: $pageIndex
      prodName: $prodName
      pageSize: $pageSize
      sort: $sort
      active: $active
    ) {
      success
      links {
        totalPages
        totalItems
        pageIndex
        pageSize
      }
      message
      data {
        _id
        name
        price
        quantity
        quantitySold
        hot
        description
        ratingCount
        cateId
        sku
        linkBuyProductOne
        linkBuyProductTwo
        linkBuyProductThree
        image {
          _id
          name
          url
          prodId
        }
        updatedAt
        keyword
        isActive
      }
    }
  }
`;

export const QUERY_PRODUCT_DETAIL = gql(`
  query Query($prodId: ID, $slug: String) {
    product(prodId: $prodId, slug: $slug) {
      success
      message
      data {
        _id
        name
        slug
        price
        quantity
        quantitySold
        hot
        sku
        description
        ratingCount
        keyword
        cateId
        brandId
        image {
          _id
          name
          url
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
          images {
            _id
            name
            url
          }
        }
        isActive
      }
    }
  }

`);

export const QUERY_IMAGES = gql(`
  query Query($prodId: String) {
    images(prodId: $prodId) {
      _id
      name
      url
      prodId
    }
  }
`);
