import { gql } from "@apollo/client";

export const QUERY_ARTICLES = gql(`
    query Articles($pageIndex: Int!, $pageSize: Int!, $sort: Int, $articleTitle: String) {
  articles(pageIndex: $pageIndex, pageSize: $pageSize, sort: $sort, articleTitle: $articleTitle) {
    data {
      _id
      title
      slug
      thumbnail
      hot
      content
      keyword
      posterId
      poster {
        userName
      }
      createdAt
    }
    links {
      pageIndex
      pageSize
      totalItems
      totalPages
    }
    message
    success
  }
}
`);

export const QUERY_ARTICLE = gql(`
    query Article($articleId: String!) {
        article(articleId: $articleId) {
            success
            message
            data {
                _id
                title
                slug
                thumbnail
                hot
                content
                createdAt
                keyword
            }
        }
    }
`);
