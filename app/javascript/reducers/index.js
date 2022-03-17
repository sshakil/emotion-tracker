import { combineReducers } from 'redux'
import times from './times'
import user from './user';

// the reducer names must be the redux entity names exactly - they can't be 'timesReduce'
export default combineReducers({
  times,
  user,
})