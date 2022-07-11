import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: new Array(1).fill({}),
  total: 0,
  count: 10,
  category: '',
  loading: false
}

const allPostsSlice = createSlice({
  name: 'all-posts',
  initialState,
  reducers: {
    setPosts(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setCount(state) {
      return {
        ...state,
        count: state.count + initialState.count
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
export const { setCategory, setCount, setLoading, setPosts } = allPostsSlice.actions

// Export Reducer
export default allPostsSlice.reducer