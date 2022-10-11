import { gql } from '@apollo/client'


export const SIGN_UP = gql`
  mutation Register(
    $form: NewUserInput!
    $reToken: String
  ) {
    result: createAccount(
      reToken: $reToken
      form: $form
    ) {
      status
      message
    }
  }
`

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail(
    $token: String!
  ) {
    result: verifyEmail(
      token: $token
    ) {
      status
      message
    }
  }
`

export const RESET_EMAIL = gql`
  mutation ResetEmail(
    $email: String!
    $reToken: String
  ) {
    result: resetEmail(
      email: $email
      reToken: $reToken
    ) {
      status
      message
    }
  }
`

export const CREATE_NEW_PASSWORD = gql`
  mutation CreateNewPassword(
    $token: String!
    $form: PasswordInput
    $reToken: String
  ) {
    result: createNewPassword(
      token: $token
      form: $form
      reToken: $reToken
    ) {
      status
      message
    }
  }
`