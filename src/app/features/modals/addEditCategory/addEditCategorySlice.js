import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  isShow: false,
  category: null
}


const addEditCategorySlice = createSlice({
  name: 'addOrEditCategory',
  initialState,
  reducers: {
    openAddEditCategoryModal(_, { payload }) { 
      return {
        isShow: true, 
        ...payload
      }
    },
    closeAddEditCategoryModal: () => ({ ...initialState })
  }
})


// Export Actions 
export const { openAddEditCategoryModal, closeAddEditCategoryModal } = addEditCategorySlice.actions

// Export Reducer
export default addEditCategorySlice.reducer