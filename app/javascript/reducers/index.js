import { combineReducers } from 'redux'
import times from './times'
import user from './user';
import day from './day'

// the reducer names must be the redux entity names exactly - they can't be 'timesReduce'
export default combineReducers({
  day,
  times,
  user,
})