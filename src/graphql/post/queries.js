import { gql } from '@apollo/client'
import { POST_DATA, POST_ITEM_DATA } from '../fragments'


export const GET_ALL_POSTS = gql`
  ${POST_ITEM_DATA}

  query Get_All_Posts($count: Int!, $category: ID) {
    result: getAllPosts(count: $count, category: $category) {
      total
      count
      posts { ...PostItemData }
    }
  }
`


export const GET_USER_POSTS = gql`
  ${POST_ITEM_DATA}

  query Get_User_Posts($category: ID) {
    result: getUserPosts(category: $category) {
      total
      posts { ...PostItemData }
    }
  }
`


export const GET_POPULAR_POSTS = gql`
  query Get_Popular_Posts($category: ID) {
    popularPosts: getPopularPosts(category: $category) {
      _id
      title
      image
      date
    }
  }
`


export const GET_POST = gql`
  ${POST_DATA}

  query Get_Post($postId: ID!, $category: ID) {
    result: getPost(postId: $postId, category: $category) {
      post { ...PostData }
      alert { 
        status 
        message
      }
    }
  }
`


export const GET_USER_POST = gql`
  ${POST_DATA}

  query Get_User_Post($postId: ID!, $category: ID) {
    result: getUserPost(postId: $postId, category: $category) {
      post { ...PostData }
      alert {
        status
        message
      }
    }
  }
`