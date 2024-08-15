import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
import combinedReducer from './reducers/index' // Ensure the path is correct

// This function sets up the Redux store with middleware and DevTools support
export default function configureStore() {
  // Apply middleware like thunk and enhance with Redux DevTools
  const store = createStore(
      combinedReducer, // The combined reducer for the application
      composeWithDevTools(
          applyMiddleware(thunk) // Applying thunk middleware for async actions
      )
  )

  // Returning the configured store
  return store
}