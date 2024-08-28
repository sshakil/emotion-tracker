import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Provider } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { redirectToOauthAuthorization, exchangeAuthorizationCodeForToken } from '../clients/api'
import configureStore from '../configureStore'
import Day from "./Day"

// Initialize the Redux store
const store = configureStore()

// PKCE Step 4: Handle OAuth Callback and Exchange Authorization Code for Access Token
function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authorizationCode = params.get('code')
    const status = params.get('status')

    if (authorizationCode) {
      // Step 5: Exchange Authorization Code for Access Token
      exchangeAuthorizationCodeForToken(authorizationCode)
        .then(() => {
          // Redirect to the main app (e.g., Day component) after successful token exchange
          navigate('/')
        })
        .catch(error => console.error('Error exchanging authorization code for token:', error))
    } else if (status === 'Pre-authorization') {
      // Option 2: Automatically handle the pre-authorization step
      // You may need to handle this based on your API's response format
      console.log('Pre-authorization detected, proceeding automatically.')
      redirectToOauthAuthorization()
    }
  }, [navigate])

  return <div>Loading...</div>
}

const App = () => {
  // Redirect to OAuth Authorization when the component is mounted
  useEffect(() => {
    // Todo: trigger this based on user actions (e.g., clicking a login button).
    redirectToOauthAuthorization()
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Day />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </LocalizationProvider>
  )
}

export default App