import { gql } from '@apollo/client'


export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $comment: String!) {
    result: addComment(postId: $postId, comment: $comment) {
      status
      message
    }
  }
`


export const EDIT_COMMENT = gql`
  mutation EditComment($postId: ID!, $data: CommentInput) {
    result: editComment(postId: $postId, data: $data) {
      status
      message
    }
  }
`


export const DELETE_COMMENT = gql`
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
    result: deleteComment(postId: $postId, commentId: $commentId) {
      status
      message
    }
  }
`