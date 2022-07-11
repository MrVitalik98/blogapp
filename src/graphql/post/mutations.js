import { gql } from '@apollo/client'


export const CREATE_POST = gql`
  mutation CreatePost ($post: PostInput!) {
    result: addPost(post: $post) {
      postId
      alert {
        status
        message
      }
    }
  }
`


export const EDIT_POST = gql`
  mutation Edit_Post (
    $postId: ID! 
    $data: PostInput
  ) {
    result: editPost(postId: $postId, data: $data) {
      status
      message
    }
  }
`


export const ADD_OR_DELETE_LIKE = gql`
  mutation AddOrDeleteLike ($postId: ID!) {
    result: addOrDeleteLike(postId: $postId) {
      status
      message
    }
  }
`


export const DELETE_POSTS = gql`
  mutation Delete_Posts ($postIDs: [ID]) {
    result: deletePosts(postIDs: $postIDs) {
      status
      message
    }
  }
`