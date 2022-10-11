import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: '',
  message: ''
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    hideAlert() {
      return { ...initialState }
    }
  }
})


// Export Actions
export const { showAlert, hideAlert } = alertSlice.actions

// Export Reducer
export default alertSlice.reducer