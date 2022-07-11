import { gql } from '@apollo/client'


export const EDIT_USER_DATA = gql`
  mutation EditUserData($data: UserInput) {
    result: editUser(data: $data) {
      status
      message
    }
  }
`

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($image: Upload!, $imageSize: Int!) {
    result: uploadAvatar(image: $image, imageSize: $imageSize) {
      status
      message
    }
  }
`

export const DELETE_AVATAR = gql`
  mutation DeleteAvatar {
    result: deleteAvatar {
      status
      message
    }
  }
`


export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($reason: String!) {
    result: deleteUser(reason: $reason) {
      status
      message
    }
  }
`