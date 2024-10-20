import { gql } from "@apollo/client";

export const MUTATE_DELETE_BANNER = gql(`
    mutation Mutation($bannerId: ID!) {
        deleteBanner(bannerId: $bannerId) {
            success
            message
            data {
                _id
                title
                url
                imageUrl
            }
        }
    }
`);

export const MUTATE_ADD_BANNER = gql(`
    mutation Mutation($file: Upload!, $banner: BannerInput!) {
        createBanner(file: $file, banner: $banner) {
            success
            message
            data {
                _id
                title
                url
                imageUrl
                isActive
                cateId
                category {
                    _id
                    name
                    isActive
                    logo
                }
            }
        }
    }
`);

export const MUTATE_EDIT_BANNER = gql(`
    mutation Mutation($bannerId: ID!, $banner: BannerInput!, $file: Upload) {
        editBanner(bannerId: $bannerId, banner: $banner, file: $file) {
            success
            message
            data {
                _id
                title
                url
                imageUrl
                isActive
                cateId
                category {
                    _id
                    name
                    isActive
                    logo
                }
            }
        }
    }
`);
