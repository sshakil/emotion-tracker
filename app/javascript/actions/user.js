import { logoutUser } from '../clients/api'

export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS'

export const logOutUser = () => async (dispatch) => {
  try {
    await logoutUser()
    dispatch({ type: LOGOUT_USER_SUCCESS })
    window.location.href = '/users/sign_in'
  } catch (error) {
    console.error('Logout action failed:', error)
  }
}