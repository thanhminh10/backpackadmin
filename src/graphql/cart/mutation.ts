import { gql } from "@apollo/client";

export const MUTATION_MULTI_DELETE_CART = gql(`
    mutation Mutation($cartIds: [ID!]) {
        multipleDeleteCart(cartIds: $cartIds) {
            success
            message
        }
    }
`);
