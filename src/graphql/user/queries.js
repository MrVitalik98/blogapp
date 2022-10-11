import { gql } from '@apollo/client'


export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user: getUser(userId: $userId) {
      _id
      firstname
      lastname
      fullname
      email
      role
      avatar
      about
    }
  }
`