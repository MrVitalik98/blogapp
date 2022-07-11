import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isShow: false,
  categoryId: ''
}

const deleteCategorySlice = createSlice({
  name: 'delete-category',
  initialState,
  reducers: {
    openDeleteCategoryModal: (_, { payload }) => ({ isShow: true, categoryId: payload }),
    closeDeleteCategoryModal: () => ({ ...initialState })
  }
})


// Export Actions 
export const { openDeleteCategoryModal, closeDeleteCategoryModal } = deleteCategorySlice.actions

// Export Reducer
export default deleteCategorySlice.reducer