const apiBaseUrl = 'http://localhost:3000'

// Flip switch to enable or disable debounce
const debounceEnabled = false

// Debounce function with immediate execution option
function debounce(delay, immediate, func) {
  let timeout
  return function (...args) {
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }, delay)
    if (callNow) func.apply(this, args)
  }
}

// Function to handle API calls with debounce applied based on the flip switch
function apiCallWithDebounce(func, ...args) {
  const delay = 500
  const immediate = true
  const debouncedFunc = debounceEnabled ? debounce(delay, immediate, func) : func
  return debouncedFunc(...args)
}

// Initiate OAuth Flow
const initiateOAuthFlow = () => apiCallWithDebounce(function () {
  const authUrl = `${apiBaseUrl}/oauth/authorize?client_id=akqEmVXu2kchRkRp1QTw6jMInXNGb3B5r0W1d5SHsSo&redirect_uri=${encodeURIComponent(apiBaseUrl + '/oauth/callback')}&response_type=code&scope=public+read+write`

  return fetch(authUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json() // Returning the parsed JSON response as a Promise
      } else if (response.status === 401) {
        console.error('Authorization required. Redirecting to login.')
        window.location.href = '/users/sign_in'
        throw new Error('401 Unauthorized')
      } else {
        console.error('Unexpected error during authorization:', response.statusText)
        throw new Error('Unexpected error during authorization')
      }
    })
    .then(data => {
      if (data.status === 'redirect' && data.redirect_uri) {
        const urlParams = new URLSearchParams(new URL(data.redirect_uri).search)
        const authorizationCode = urlParams.get('code')
        if (authorizationCode) {
          return exchangeAuthorizationCodeForToken(authorizationCode) // Handle the token exchange and store the token
        } else {
          console.error('Authorization code not found in redirect_uri')
          throw new Error('Authorization code not found')
        }
      }
    })
})

// Exchange Authorization Code for Token
const exchangeAuthorizationCodeForToken = (authorizationCode) => apiCallWithDebounce(function () {
  const tokenUrl = `${apiBaseUrl}/oauth/token`
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: 'akqEmVXu2kchRkRp1QTw6jMInXNGb3B5r0W1d5SHsSo',
    redirect_uri: `${apiBaseUrl}/oauth/callback`
  })

  console.log('About to fetch token with authorizationCode:', authorizationCode)

  return fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })
    .then(response => response.json())
    .then(data => {
      console.log('Token data:', data)
      if (data.access_token) {
        localStorage.setItem('token', data.access_token) // Store the token for subsequent API calls
        return data
      } else {
        console.error('Token exchange failed:', data)
        throw new Error('Token exchange failed')
      }
    })
})

function getAuthorizationHeader() {
  const token = localStorage.getItem('token')
  return `Bearer ${token}`
}

function fetchDay(id) {
  return fetch(`${apiBaseUrl}/days/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    }
  })
}

function fetchDayByDate(date) {
  return fetch(`${apiBaseUrl}/days/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    },
    body: JSON.stringify({ date })
  })
}

function postEntries(selectedDate, periodName, emotions) {
  const body = {
    day: {
      date: selectedDate,
      periods_attributes: [
        {
          name: periodName,
          emotions_attributes: Array.isArray(emotions) ? emotions.map(emotion => ({ name: emotion })) : [{ name: emotions }]
        }
      ]
    }
  }

  return fetch(`${apiBaseUrl}/days`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    },
    body: JSON.stringify(body)
  })
}

function deleteEntryAPI(entryUuid) {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  return fetch(`${apiBaseUrl}/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    }
  })
}

export { fetchDay, fetchDayByDate, postEntries, deleteEntryAPI, initiateOAuthFlow, exchangeAuthorizationCodeForToken }