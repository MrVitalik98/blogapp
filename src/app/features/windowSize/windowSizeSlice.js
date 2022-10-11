import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  width: 0,
  height: 0
}


const windowSizeSlice = createSlice({
  name: 'window-size',
  initialState,
  reducers: {
    setWindowSize: () => ({ 
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
})


// Export Actions
export const { setWindowSize } = windowSizeSlice.actions

// Export Reducer
export default windowSizeSlice.reducer