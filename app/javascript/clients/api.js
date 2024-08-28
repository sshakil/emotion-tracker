// PKCE Step 1 & 2: Generate Code Verifier and Code Challenge
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'

function generateRandomString(length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

function generateCodeChallenge(codeVerifier) {
  return CryptoJS.enc.Base64.stringify(sha256(codeVerifier))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// PKCE Step 3: Authorization Request - Redirect to OAuth Authorization URL
function redirectToOauthAuthorization() {
  const codeVerifier = generateRandomString(128)
  const codeChallenge = generateCodeChallenge(codeVerifier)

  // Save the codeVerifier to localStorage or sessionStorage to use it later
  localStorage.setItem('code_verifier', codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: 'akqEmVXu2kchRkRp1QTw6jMInXNGb3B5r0W1d5SHsSo', // from Doorkeeper::Application - uid
    redirect_uri: 'http://localhost:3000/oauth/callback', // from Doorkeeper::Application - redirect_uri
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  window.location.href = `http://localhost:3000/oauth/authorize?${params.toString()}`
}

// PKCE Step 5: Token Request - Exchange Authorization Code for Access Token
function exchangeAuthorizationCodeForToken(authorizationCode) {
  const codeVerifier = localStorage.getItem('code_verifier')
  const tokenUrl = 'http://localhost:3000/oauth/token'

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode, // Received from the authorization step
    client_id: 'akqEmVXu2kchRkRp1QTw6jMInXNGb3B5r0W1d5SHsSo', // from Doorkeeper::Application - uid
    redirect_uri: 'http://localhost:3000/oauth/callback', // from Doorkeeper::Application - redirect_uri
    code_verifier: codeVerifier, // Send the original code verifier
  })

  return fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
    .then(response => response.json())
    .then(data => {
      // Save the access token
      localStorage.setItem('token', data.access_token)
      return data
    })
}

// PKCE Step 6: Use Access Token in API Calls
function fetchDay(id) {
  const token = localStorage.getItem('token')
  return fetch(`days/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
}

function fetchDayByDate(date) {
  const token = localStorage.getItem('token')
  return fetch(`days/fetch`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    method: 'POST',
    body: JSON.stringify({ "date": date })
  })
}

function postEntries(selectedDate, periodName, emotions) {
  const token = localStorage.getItem('token')
  const body = {
    "day": {
      "date": selectedDate,
      "periods_attributes": [
        {
          "name": periodName,
          "emotions_attributes": Array.isArray(emotions) ? emotions.map(emotion => {
            return { "name": emotion }
          }) : [{ "name": emotions }]
        }]
    }
  }

  return fetch(`days`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
}

function deleteEntryAPI(entryUuid) {
  const token = localStorage.getItem('token')

  return fetch(`/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  })
}

export { fetchDay, fetchDayByDate, postEntries, deleteEntryAPI, redirectToOauthAuthorization, exchangeAuthorizationCodeForToken }