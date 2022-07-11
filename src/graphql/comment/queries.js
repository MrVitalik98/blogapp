import { gql } from '@apollo/client'


export const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    result: getComments(postId: $postId) {
      comments {
        _id
        comment
        author {
          _id
          fullname
          avatar
        }
        date
      }
      alert {
        status
        message
      }
    }
  }
`