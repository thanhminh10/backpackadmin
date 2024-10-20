import { gql } from "@apollo/client";

export const MUTATE_MULTI_DELETE_CATE = gql(`
    mutation Mutation($cateIds: [ID]) {
        multipleDeleteCategories(cateIds: $cateIds) {
            success
            message
            data {
                _id
                name
                isActive
                logo
            }
        }
    }
`);

export const MUTATE_ADD_CATE = gql(`
    mutation Mutation($logo: Upload, $cate: CategoryInput) {
        createCategory(logo: $logo, cate: $cate) {
            success
            message
            data {
                _id
                name
                isActive
                logo
                icon
            }
        }
    }
`);

export const MUTATE_EDIT_CATE = gql(`
    mutation Mutation($cateId: ID!, $category: CategoryInput!, $logo: Upload) {
        editCategory(cateId: $cateId, category: $category, logo: $logo) {
            success
            message
            data {
                _id
                name
                isActive
                logo
                icon
            }
        }
    }
`);
