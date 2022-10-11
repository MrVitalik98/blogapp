import { gql } from '@apollo/client'


export const GET_REASONS = gql`
  query GetReasons {
    reasonList: getReasons {
      id
      title
    }
  }
`