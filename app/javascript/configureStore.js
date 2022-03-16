import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  user: {},
  times: [
    {
      name: "morning",
      guid: "23"
    }
  ]
}

function rootReducer(state, action) {
  console.log("rootReducer - action.type:", action.type)
  switch (action.type) {
    default:
      return state
  }
}

export default function configureStore() {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
      )
    )
  )
}