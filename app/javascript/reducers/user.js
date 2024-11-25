import { LOGOUT_USER_SUCCESS } from '../actions/user'

const initialState = {
  name: 'public-store-default',
  guid: 'default',
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'GET_USER_SUCCESS':
      return action.json.user
    case LOGOUT_USER_SUCCESS:
      return initialState
    default:
      return state
  }
}