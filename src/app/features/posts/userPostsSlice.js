import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  total: 0,
  category: '',
  loading: false
}

const userPostsSlice = createSlice({
  name: 'user-posts',
  initialState,
  reducers: {
    setPosts(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setCategory(state, { payload }) {
      return {
        ...state,
        category: payload !== state.category ? payload : ''
      }
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload
      }
    }
  }
})



// Export Actions
export const { setCategory, setLoading, setPosts } = userPostsSlice.actions

// Export Reducer
export default userPostsSlice.reducer