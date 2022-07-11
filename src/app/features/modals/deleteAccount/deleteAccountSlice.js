import { createSlice } from '@reduxjs/toolkit'


const deleteAccountSlice = createSlice({
  name: 'delete-account',
  initialState: { isShow: false },
  reducers: {
    openDeleteAccountModal: () => ({ isShow: true }),
    closeDeleteAccountModal: () => ({ isShow: false })
  }
})


// Export Actions
export const { openDeleteAccountModal, closeDeleteAccountModal } = deleteAccountSlice.actions

// Export Reducer
export default deleteAccountSlice.reducer