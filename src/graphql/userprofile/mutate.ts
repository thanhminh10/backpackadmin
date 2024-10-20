import { gql } from "@apollo/client";

export const MUTATION_EDIT_PROFILE_USER =  gql(`
    mutation EditUser($userId: String!, $profile: UserRegister, $avatar: Upload) {
  editUser(userId: $userId, profile: $profile, avatar: $avatar) {
    data {
      _id
      userName
      email
      phone
      userLevel
      avatar
      birthDay
      gender
      password
    }
    message
    success
  }
}
`)


export const MUTATION_CHANGPASSWORD_USER =  gql(`
  mutation ResetPassword($email: String!, $password: String!, $currentPassword: String) {
  resetPassword(email: $email, password: $password, currentPassword: $currentPassword) {
    data {
      token
    }
    message
    success
  }
}`)