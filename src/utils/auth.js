import { login } from '../app/features/login/loginSlice'
const AUTH_TOKEN = 'STORAGE/AUTH_TOKEN'

export const authUser = (token, user) => {
  return dispatch => {
    dispatch(login({ token, user }))
    token && localStorage.setItem(AUTH_TOKEN, JSON.stringify({ token }))
  }
}

export const getAuthToken = () => {
  const data = JSON.parse(localStorage.getItem(AUTH_TOKEN))
  return (data && data?.token) || ''
}

export const authUserByToken = user => {
  return dispatch => {
    const token = getAuthToken()
    token && dispatch(login({ token, user }))
  }
}

export const logout = () => {
  return dispatch => {
    localStorage.removeItem(AUTH_TOKEN)
    dispatch(login({ token: '', user: '' }))
  }
}