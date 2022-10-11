import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  multi: false,
  isShow: false,
  postIDs: [],
  loading: false
}


const deletePostsSlice = createSlice({
  name: 'selected-posts',
  initialState,
  reducers: {
    openDeletePostsModal(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShow: true
      }
    },
    closeDeletePostsModal: () => ({ ...initialState }),
    setLoading: (state, { payload }) => ({ ...state, loading: payload })
  }
})


// Export Actions
export const { openDeletePostsModal, closeDeletePostsModal, setLoading } = deletePostsSlice.actions

// Export Reducer
export default deletePostsSlice.reducer