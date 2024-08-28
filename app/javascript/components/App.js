import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import configureStore from '../configureStore'
import Day from "./Day"
import { initiateOAuthFlow } from "../clients/api"

const store = configureStore()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setLoading(false)
    } else {
      initiateOAuthFlow()
        .then(() => {
          setIsAuthenticated(true)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null // If not authenticated, render nothing (OAuth flow will be initiated)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Day />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </LocalizationProvider>
  )
}

export default App