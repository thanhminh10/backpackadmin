import { gql } from "@apollo/client";

export const MUTATION_MULTI_DELETE_REVIEW = gql(`
  mutation Mutation($reviewIds: [ID]) {
    multipleDeleteReviews(reviewIds: $reviewIds) {
      success
      message
      data {
        _id
        comment
        rating
        user {
          _id
          userName
          email
          phone
          password
          userLevel
        }
        prodId
      }
    }
  }
`);

export const MUTATION_CREATE_REVIEW = gql(`
  mutation Mutation($review: ReviewInput!, $prodId: String!, $files: [Upload!]) {
    createReview(review: $review, prodId: $prodId, files: $files) {
      success
      message
      data {
        _id
        comment
        rating
        user {
          _id
          userName
          email
          phone
          password
          userLevel
        }
        images {
          _id
          name
          url
          reviewId
        }
        prodId
      }
    }
  }
`);

export const MUTATION_EDIT_REVIEW = gql(`
  mutation Mutation($reviewId: ID!, $review: ReviewInput!) {
    editReview(reviewId: $reviewId, review: $review) {
      success
      message
      data {
        _id
        comment
        rating
        user {
          _id
          userName
          email
          phone
          password
          userLevel
        }
        images {
          _id
          name
          url
        }
        prodId
      }
    }
  }
`);

export const MUTATION_TOGGLE_REVIEW = gql(`
  mutation Mutation($reviewId: ID!) {
    toggleReview(reviewId: $reviewId) {
      success
      message
      data {
        _id
        comment
        rating
        active
        prodId
      }
    }
  }
`);
