const apiBaseUrl = 'http://localhost:3000'
const defaultClientId = 'akqEmVXu2kchRkRp1QTw6jMInXNGb3B5r0W1d5SHsSo'
const defaultScope = 'public read write'

// Toggle OAuth flow based on environment variable
const enableOAuth = process.env.ENABLE_OAUTH === 'true';

// OAuth: Step 1: Register Web Clients as an Application: was done manually in backend db in this case

// Helper function to handle API responses
const handleApiResponse = (response) => {
  if (response.ok) return response.json()
  if (response.status === 401) {
    console.error('Authorization required. Redirecting to login.')
    window.location.href = '/users/sign_in'
    throw new Error('401 Unauthorized')
  }
  console.error('Unexpected error:', response.statusText)
  throw new Error('Unexpected error during API call')
}

// OAuth: Step 2: Request Authorization Code - Redirect the user to the authorization endpoint to obtain an authorization code from /oauth/authorize.
const initiateOAuthFlow = (clientId = defaultClientId, scope = defaultScope) => {
  if (!enableOAuth) {
    console.log('OAuth is disabled.');
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${apiBaseUrl}/oauth/callback`,
    response_type: 'code',
    scope,
  })

  const authUrl = `${apiBaseUrl}/oauth/authorize?${params.toString()}`

  return fetch(authUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(handleApiResponse)
    // OAuth: Step 3: Obtain Authorization Code - Obtain the authorization code from the response after user authorization.
    .then(data => {
      const urlParams = new URLSearchParams(new URL(data.redirect_uri).search)
      const authorizationCode = urlParams.get('code')
      if (!authorizationCode) throw new Error('Authorization code not found')
      // OAuth: Step 4: Exchange Authorization Code for Access Token - Exchange the authorization code for an access token at /oauth/token
      return exchangeAuthorizationCodeForToken(authorizationCode, clientId)
    })
}

// OAuth: Step 4: Exchange Authorization Code for Access Token - Exchange at /oauth/token
const exchangeAuthorizationCodeForToken = (authorizationCode, clientId = defaultClientId) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: clientId,
    redirect_uri: `${apiBaseUrl}/oauth/callback`
  })

  const tokenUrl = `${apiBaseUrl}/oauth/token`

  return fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })
    .then(handleApiResponse)
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        return data
      }
      throw new Error('Token exchange failed')
    })
}

// OAuth: Step 5: Handle Token Expiry and Use Refresh Tokens to Obtain New Access Tokens - TODO

// OAuth: Step 6: Invalidate Tokens When No Longer Needed - TODO

// OAuth: Step 7: Implement a User Logout Endpoint - TODO

const getAuthorizationHeader = () => `Bearer ${localStorage.getItem('token')}`

// Generic function to make authenticated API requests
const apiRequest = (endpoint, method, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    }
  }
  if (body) options.body = JSON.stringify(body)
  return fetch(`${apiBaseUrl}${endpoint}`, options)
}

// OAuth: Step 8: Secure API Endpoints - Securing API calls with Bearer token
const fetchDayByDate = (date) => apiRequest('/days/fetch', 'POST', { date })

const postEntries = (selectedDate, periodName, emotions) => {
  const body = {
    day: {
      date: selectedDate,
      periods_attributes: [
        {
          name: periodName,
          emotions_attributes: Array.isArray(emotions) ? emotions.map(name => ({ name })) : [{ name: emotions }]
        }
      ]
    }
  }
  return apiRequest('/days', 'POST', body)
}

const deleteEntryAPI = (entryUuid) => {
  const tokenElement = document.querySelector('meta[name="csrf-token"]')
  const token = tokenElement ? tokenElement.getAttribute('content') : null

  if (!token) {
    console.error('CSRF token not found.')
  }

  return fetch(`${apiBaseUrl}/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    }
  })
}

export { fetchDayByDate, postEntries, deleteEntryAPI, initiateOAuthFlow, exchangeAuthorizationCodeForToken }