import { gql } from '@apollo/client'


export const ADD_CATEGORY = gql`
  mutation AddCategory($name: String) {
    result: addCategory(name: $name) {
      status
      message
    }
  }
`

export const EDIT_CATEGORY = gql`
  mutation EditCategory($categoryId: ID!, $name: String) {
    result: editCategory(categoryId: $categoryId, name: $name) {
      status
      message
    }
  }
`


export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: ID!) {
    result: deleteCategory(categoryId: $categoryId) {
      status
      message
    }
  }
`