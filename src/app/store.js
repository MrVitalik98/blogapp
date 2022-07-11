import { combineReducers, configureStore } from "@reduxjs/toolkit"
import loginSlice from './features/login/loginSlice'
import alertSlice from './features/alert/alertSlice'
import loaderSlice from './features/loader/loaderSlice'
import allPostsReducer from './features/posts/allPostsSlice'
import userPostsReducer from './features/posts/userPostsSlice'
import windowSizeReducer from './features/windowSize/windowSizeSlice'
import modals from './features/modals'


const reducer = combineReducers({
  auth: loginSlice,
  alert: alertSlice,
  loader: loaderSlice,
  allPosts: allPostsReducer,
  userPosts: userPostsReducer,
  windowSize: windowSizeReducer,
  modals
})


export default configureStore({
  reducer,
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({ 
      serializableCheck: false,
      immutableCheck: false
    })
})

