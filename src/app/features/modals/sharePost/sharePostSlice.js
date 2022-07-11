import { createSlice } from '@reduxjs/toolkit'


const sharePostSlice = createSlice({
  name: 'share-post',
  initialState: { isShow: false, post: {} },
  reducers: {
    openSharePostModal: (_, { payload }) => ({ isShow: true, post: payload }),
    closeSharePostModal: () => ({ isShow: false, post: {} })
  }
})


// Export Actions
export const { openSharePostModal, closeSharePostModal } = sharePostSlice.actions

// Export Reducer
export default sharePostSlice.reducer