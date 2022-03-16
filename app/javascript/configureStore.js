import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  user: {},
  times: [
    {
      name: "morning",
      guid: "default"
    }
  ]
}

function rootReducer(state, action) {
  console.log("rootReducer - action.type:", action.type)
  switch (action.type) {
    case "GET_TIMES_SUCCESS":
      return { times: action.json.times }
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