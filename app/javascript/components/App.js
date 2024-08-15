import React from "react"
import Day from "./Day"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux"

import configureStore from '../configureStore'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers"
const store = configureStore()

class App extends React.Component {
  render () {
    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path={ "/" } element = { <Day /> } />
            </Routes>
          </BrowserRouter>
        </Provider>
      </LocalizationProvider>
    )
  }
}

export default App
