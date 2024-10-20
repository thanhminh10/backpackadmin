import { gql } from "@apollo/client";

export const MUTATION_LOGIN = gql(`
    mutation Login($userLogin: Login!) {
        login(userLogin: $userLogin) {
            success
            message
            data {
                token
            }
        }
    }
`);
