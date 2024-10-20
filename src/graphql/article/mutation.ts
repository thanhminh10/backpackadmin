import { gql } from "@apollo/client";

export const MUTATION_MULTI_DELETE_ARTICLE = gql(`
    mutation Mutation($articleIds: [ID!]) {
        multiDeleteArticle(articleIds: $articleIds) {
            success
            message
            data {
                _id
                title
                slug
                thumbnail
                hot
                content
                keyword
            }
        }
    }
`);

export const MUTATION_ADD_ARTICLE = gql(`
    mutation CreateArticle($article: ArticleInput!, $file: Upload!) {
        createArticle(article: $article, file: $file) {
            success
            message
            data {
                _id
                title
                slug
                thumbnail
                hot
                content
                keyword
            }
        }
    }
`);

export const MUTATION_EDIT_ARTICLE = gql(`
    mutation Mutation($articleId: ID!, $article: ArticleInput!, $file: Upload) {
        editArticle(articleId: $articleId, article: $article, file: $file) {
            success
            message
            data {
                _id
                title
                slug
                thumbnail
                hot
                content
                keyword
            }
        }
    }
`);

export const MUTATION_ADD_LIST_ARTICLE = gql(`
    mutation Mutation($articles: [ArticleInput!]) {
        createListArticle(articles: $articles) {
            success
            message
            data {
                _id
                title
                slug
                hot
                content
                createdAt
                thumbnail
                keyword
            }
        }
    }
`);
