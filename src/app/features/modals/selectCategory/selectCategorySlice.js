import { createSlice } from '@reduxjs/toolkit'


const selectCategorySlice = createSlice({
  name: 'select-category',
  initialState: { isShow: false },
  reducers: {
    openSelectCategoryModal: () => ({ isShow: true }),
    closeSelectCategoryModal: () => ({ isShow: false })
  }
})


// Export Actions 
export const { openSelectCategoryModal, closeSelectCategoryModal } = selectCategorySlice.actions

// Export Reducer
export default selectCategorySlice.reducer