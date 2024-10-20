import { gql } from "@apollo/client";

export const MUTATION_DELETE_USER = gql(`
    mutation Mutation($userId: ID!) {
        deleteUser(userId: $userId) {
            success
            message
            data {
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

export const MUTATION_ADD_USER = gql(`
   mutation Register($userRegister: UserRegister) {
  register(userRegister: $userRegister) {
    message
    success
    data {
      token
    }
  }
}
`);

export const MUTATION_EDIT_USER = gql(`
    mutation Mutation($userId: String!, $profile: ProfileInput, $file: Upload) {
        editProfileUser(userId: $userId, profile: $profile, file: $file) {
            success
            message
            data {
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