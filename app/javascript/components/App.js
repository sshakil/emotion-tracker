import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import configureStore from '../configureStore'
import Day from "./Day"
import { initiateOAuthFlow } from "../clients/api"

const store = configureStore()

const OAuthHandler = ({ onAuthSuccess, onAuthFailure }) => {
  useEffect(() => {
    let isMounted = true

    const startOAuthFlow = async () => {
      try {
        const result = await initiateOAuthFlow()
        if (isMounted && result) {
          onAuthSuccess()
        }
      } catch (error) {
        console.error('OAuth flow failed.', error)
        if (isMounted) {
          onAuthFailure()
        }
      }
    }

    startOAuthFlow().then(() => {
      if (isMounted) {
        onAuthSuccess()
      }
    }).catch(() => {
      if (isMounted) {
        onAuthFailure()
      }
    })

    return () => {
      isMounted = false
    }
  }, [onAuthSuccess, onAuthFailure])

  return <div>Authenticating...</div>
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setLoading(false)
  }

  const handleAuthFailure = () => {
    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <OAuthHandler onAuthSuccess={handleAuthSuccess} onAuthFailure={handleAuthFailure} />
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