import { gql } from "@apollo/client";

export const MUTATION_UPLOAD_SINGLE_IMAGE = gql(`
    mutation Mutation($imageFile: Upload!, $imageId: String) {
        uploadSingleImage(imageFile: $imageFile, imageId: $imageId) {
            success
            message
            data {
                _id
                name
                url
            }
        }
    }
`);
