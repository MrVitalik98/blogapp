import { gql } from '@apollo/client'


export const USER_DATA = gql`
  fragment UserData on AuthData {
    user {
      _id
      firstname
      lastname
      fullname
      email
      role
      avatar
      about
    }
    token
    status
    message
  }
`


export const POST_ITEM_DATA = gql`
  fragment PostItemData on Post {
    _id
    date
    title
    likes
    image
    comments
    description
    author {
      avatar
      fullname
    }
    category {
      _id
    }
  }
`


export const POST_DATA = gql`
  fragment PostData on Post {
    _id
    date
    title
    likes
    image
    comments
    description
    author {
      _id
      avatar
      fullname
      about
    }
    category {
      _id
    }
    nextPost {
      _id
      date
      image
      title
    }
    previousPost {
      _id
      date
      image
      title
    }
  }
`