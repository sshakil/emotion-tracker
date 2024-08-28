import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import configureStore from '../configureStore'
import Day from "./Day"
import { redirectToOauthAuthorization, exchangeAuthorizationCodeForToken } from '../clients/api'

const store = configureStore()

const OAuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authorizationCode = params.get('code')

    if (authorizationCode) {
      exchangeAuthorizationCodeForToken(authorizationCode)
        .then(() => {
          navigate('/')
        })
        .catch(error => console.error('Error exchanging authorization code for token:', error))
    }
  }, [navigate])

  return <div>Loading...</div>
}

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      redirectToOauthAuthorization()
    }
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Day />} />
            <Route path="/callback" element={<OAuthCallback />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </LocalizationProvider>
  )
}

export default App