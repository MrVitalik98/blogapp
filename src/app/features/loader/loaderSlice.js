import { createSlice } from '@reduxjs/toolkit'


const loaderSlice = createSlice({
  name: 'loader',
  initialState: { loading: false },
  reducers: {
    showLoader() {
      return { loading: true }
    },
    hideLoader() {
      return { loading: false }
    }
  }
})


// Export Actions
export const { showLoader, hideLoader } = loaderSlice.actions

// Export Reducer
export default loaderSlice.reducer