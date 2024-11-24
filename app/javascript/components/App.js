import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import configureStore from '../configureStore'
import TabbedComponentContainer from "./TabbedComponentContainer"
import { initiateOAuthFlow } from "../clients/api"

const store = configureStore()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const enableOAuth = process.env.ENABLE_OAUTH === 'true'  // Toggle based on env var

  useEffect(() => {
    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
    const authenticate = async () => {
      if (!enableOAuth) {
        console.log('OAuth is disabled for this environment.')
        setIsAuthenticated(true)
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      if (token) {
        setIsAuthenticated(true)
      } else {
        try {
          // OAuth: Step 2: Request Authorization Code - Redirect user to obtain authorization code from /oauth/authorize
          await initiateOAuthFlow()
          setIsAuthenticated(true)
        } catch {
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    authenticate()
  }, [enableOAuth])

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Authentication failed. Please try again.</div>

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TabbedComponentContainer />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </LocalizationProvider>
  )
}

export default App