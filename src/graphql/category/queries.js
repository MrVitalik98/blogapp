import { gql } from '@apollo/client'


export const GET_CATEGORIES = gql`
  query GetCategories {
    categories: getCategories {
      _id
      name
      posts
    }
  }
`


export const GET_CATEGORY = gql`
  query GetCategory($categoryId: ID!) {
    category: getCategory(categoryId: $categoryId) {
      _id
      name
      posts {
        _id
        image
        title
        date
        likes
        comments
        description
        author {
          avatar
          fullname
        }
      }
    }
  }
`