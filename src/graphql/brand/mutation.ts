import { gql } from "@apollo/client";

export const MUTATE_MULTi_DELETE_BRAND = gql(`
    mutation Mutation($brandIds: [ID!]) {
        multipleDeleteBrand(brandIds: $brandIds) {
            success
            message
            data {
                _id
                name
                isActive
            }
        }
    }
`);

export const MUTATE_ADD_BRAND = gql(`
mutation CreateBrand($brand: BrandInput!, $file: Upload) {
  createBrand(brand: $brand, file: $file) {
    data {
      _id
      isActive
      logo
      name
    }
    message
    success
  }
}
`);

export const MUTATE_EDIT_BRAND = gql(`
    mutation Mutation($brandId: ID!, $brand: BrandInput!, $file: Upload) {
        editBrand(brandId: $brandId, brand: $brand, file: $file) {
            success
            message
            data {
                _id
                name
                logo
                isActive
            }
        }
    }
`);
