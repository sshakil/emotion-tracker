const apiBaseUrl = process.env.API_BASE_URL
const defaultClientId = process.env.OAUTH_CLIENT_ID
const defaultScope = 'public read write'

// Toggle OAuth flow based on environment variable
const enableOAuth = process.env.ENABLE_OAUTH === 'true';

// OAuth: Step 1: Register Web Clients as an Application: was done manually in backend db in this case

// OAuth Step 1.1: get App Client ID for Web
async function fetchOAuthUidOrDefault() {
  try {
    const response = await fetch('/api/oauth_public_uid')
    const data = await response.json()
    return data.uid
  } catch (error) {
    console.warn('Error fetching OAuth UID. Falling back to default. ', error)
    return defaultClientId
  }
}

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
const initiateOAuthFlow = async (scope = defaultScope) => {
  if (!enableOAuth) {
    console.log('OAuth is disabled.');
    return;
  }

  const clientUid = await fetchOAuthUidOrDefault()

  const params = new URLSearchParams({
    client_id: clientUid,
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
      return exchangeAuthorizationCodeForToken(authorizationCode, clientUid)
    })
}

// OAuth: Step 4: Exchange Authorization Code for Access Token - Exchange at /oauth/token
// must stay a local function, or will need to handle clientUid through state/store
const exchangeAuthorizationCodeForToken = (authorizationCode, clientUid) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: clientUid,
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

const getCSRFToken = () => {
  // First, try to get the CSRF token from the <meta> tag, for how currently RoR stashes it
  const tokenElement = document.querySelector('meta[name="csrf-token"]');
  if (tokenElement) {
    const token = tokenElement.getAttribute('content');
    if (token) {
      return token;
    } else {
      console.warn("CSRF token not found.")
    }
  }

  // If not found in the <meta> tag, try to get the CSRF token from cookies, for Django
  const csrfTokenName = 'csrftoken';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${csrfTokenName}=`)) {
      return cookie.substring(csrfTokenName.length + 1);
    }
  }

  // If no CSRF token is found in both places, log an error
  console.error('CSRF token not found.');
  return null;
}

// Generic function to make authenticated API requests
const apiRequest = (endpoint, method, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(),
      'X-CSRFToken': getCSRFToken(),
    }
  }
  if (body) options.body = JSON.stringify(body)
  return fetch(`${apiBaseUrl}${endpoint}`, options)
}

// OAuth: Step 8: Secure API Endpoints - Securing API calls with Bearer token
const fetchDayByDate = (date) => apiRequest('/days/fetch', 'POST', {date})

const fetchLast30DaysFromAPI = async () => {
  console.log("fetchLast30DaysFromAPI")
  return apiRequest('/days?recent=true&limit=30', 'GET')
}

const postEntries = (selectedDate, periodName, emotions) => {
  const body = {
    day: {
      date: selectedDate,
      periods_attributes: [
        {
          name: periodName,
          emotions_attributes: Array.isArray(emotions) ? emotions.map(name => ({name})) : [{name: emotions}]
        }
      ]
    }
  }
  return apiRequest('/days', 'POST', body)
}

const deleteEntryAPI = (entryUuid) => {
  return fetch(`${apiBaseUrl}/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': getCSRFToken(),
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    }
  })
}

const logoutUser = async () => {
  try {
    const response = await apiRequest('/users/sign_out', 'DELETE')
    if (response.ok) {
      localStorage.removeItem('token')
    } else {
      console.error("Error code during logout: ", response.status)
    }
    return response
  } catch (error) {
    console.error('Error during logout:', error)
    throw error
  }
}

export {
  fetchLast30DaysFromAPI,
  fetchDayByDate,
  postEntries,
  deleteEntryAPI,
  initiateOAuthFlow,
  logoutUser,
}