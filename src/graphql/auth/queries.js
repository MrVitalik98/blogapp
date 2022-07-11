import { gql } from '@apollo/client'
import { USER_DATA } from '../fragments'


export const AUTH_BY_TOKEN = gql`
  ${USER_DATA}

  query AuthByToken($token: String!) {
    authData:authByToken(token: $token) {
      ...UserData
    }
  }
`

export const SIGN_IN = gql`
  ${USER_DATA}

  query Login($email: String, $password: String, $reToken: String) {
    authData:login(email: $email, password: $password, reToken: $reToken) {
      ...UserData
    }
  }
`


export const CHECK_TOKEN = gql`
  query CheckToken($token: String!) {
    result: checkToken(token: $token) {
      status
      message
    }
  }
`