import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: '',
  user: {}
}

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    login(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    logout() {
      return {
        ...initialState
      }
    },
    setUser(state, { payload }) {
      return {
        ...state,
        user: { ...payload }
      }
    }
  }
})


// Export Actions
export const { login, logout, setUser } = loginSlice.actions

// Export Reducer
export default loginSlice.reducer