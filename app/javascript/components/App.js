import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import configureStore from "../configureStore"
import Day from "./Day"
import { exchangeAuthorizationCodeForToken } from "../clients/api"

const store = configureStore()

const OAuthHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authorizationCode = params.get("code")

    if (authorizationCode) {
      exchangeAuthorizationCodeForToken(authorizationCode)
        .then(() => {
          navigate("/")  // Navigate to the home page after a successful exchange
        })
        .catch(error => console.error("Error exchanging authorization code for token:", error))
    }
  }, [navigate])

  return <div>Loading...</div>
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for authentication token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false) // Set loading to false after checking
  }, [])

  // Handle redirects and authentication state
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/users/sign_in" // Redirect to login if not authenticated
    }
  }, [loading, isAuthenticated])

  // Render the application once authentication is confirmed
  if (loading) {
    return <div>Loading...</div> // Display a loading message while checking auth state
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Day />} />
            <Route path="/callback" element={<OAuthHandler />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </LocalizationProvider>
  )
}

export default App