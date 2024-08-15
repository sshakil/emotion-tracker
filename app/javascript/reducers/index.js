import { combineReducers } from 'redux'
import times from './times'
import user from './user'
import days from './days'
import selectedDate from './selectedDate'

// the reducer names must be the redux entity names exactly - they can't be 'timesReduce'
export default combineReducers({
  days,
  times,
  user,
  selectedDate,
})