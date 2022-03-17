import {
  createStore,
  applyMiddleware,
} from "redux";
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";

import combinedReducer from './reducers/index'

export default function configureStore() {
  return createStore(
    combinedReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk,
      )
    )
  )
}