import { combineReducers } from '@reduxjs/toolkit'
import sharePostReducer from './sharePost/sharePostSlice'
import deletePostsReducer from './deletePosts/deletePostsSlice'
import deleteAvatarReducer from './deleteAvatar/deleteAvatarSlice'
import deleteAccountReducer from './deleteAccount/deleteAccountSlice'
import selectCategoryReducer from './selectCategory/selectCategorySlice'
import deleteCategoryReducer from './deleteCategory/deleteCategorySlice'
import addEditCategoryReducer from './addEditCategory/addEditCategorySlice'


export default combineReducers({
  sharePost: sharePostReducer,
  deletePosts: deletePostsReducer,
  deleteAvatar: deleteAvatarReducer,
  deleteAccount: deleteAccountReducer,
  selectCategory: selectCategoryReducer,
  deleteCategory: deleteCategoryReducer,
  addEditCategory: addEditCategoryReducer
})