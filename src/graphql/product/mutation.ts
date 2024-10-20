import { gql } from "@apollo/client";

export const MUTATION_CREATE_PRODUCT = gql`
  mutation Mutation($prods: [ProductInput]) {
    createProduct(prods: $prods) {
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
        sku
        hot
        description
        ratingCount
        cateId
        linkBuyProductOne
        linkBuyProductTwo
        linkBuyProductThree
        updatedAt
        keyword
        isActive
      }
    }
  }
`;

export const MUTATION_EDIT_PRODUCT = gql(`
  mutation Mutation($prodId: ID!, $product: ProductInput) {
    editProduct(prodId: $prodId, product: $product) {
      success
      message
      data {
        _id
        name
        price
        quantity
        quantitySold
        hot
        description
        sku
        ratingCount
        cateId
        image {
          name
          url
          prodId
        }
        linkBuyProductOne
        linkBuyProductTwo
        linkBuyProductThree
        updatedAt
        keyword
        isActive
      }
    }
  }
  `);

export const MUTATION_MULTI_DELETE_PRODUCT = gql(`
  mutation Mutation($prodIds: [ID]) {
    multipleDeleteProduct(prodIds: $prodIds) {
      success
      message
    }
  }
  `);

export const MUTATION_DELETE_PRODUCT_BY_ID = gql(`
  mutation DeleteProduct($prodId: ID!) {
  deleteProduct(prodId: $prodId) {
    message
    success
  }
}
  `);

export const MUTATION_UPLOAD_IMAGE = gql(`
    mutation Mutation($files: [Upload]!, $prodId: String) {
      uploadImage(files: $files, prodId: $prodId) {
        success
        message
        data {
          name
          url
          prodId
        }
      }
    }
`);

export const MUTATION_DELETE_IMAGE = gql(`
  mutation Mutation($imageId: ID!) {
    deleteImage(imageId: $imageId) {
      success
      message
      data {
        name
        url
        prodId
      }
    }
  }
`);
