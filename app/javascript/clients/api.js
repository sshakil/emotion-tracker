const clientId = 'akqEmVXu2kchRkRp1QTw6jMInXNGb3B5r0W1d5SHsSo'
const redirectUri = 'http://localhost:3000/oauth/callback'

// Redirect to OAuth Authorization URL
function redirectToOauthAuthorization() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
  })

  window.location.href = `http://localhost:3000/oauth/authorize?${params.toString()}`
}

// Exchange Authorization Code for Access Token
function exchangeAuthorizationCodeForToken(authorizationCode) {
  const tokenUrl = 'http://localhost:3000/oauth/token'

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: clientId,
    redirect_uri: redirectUri,
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

// Use Access Token in API Calls
function fetchDay(id) {
  const token = localStorage.getItem('token')
  return fetch(`days/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
}

function fetchDayByDate(date) {
  const token = localStorage.getItem('token')
  return fetch(`days/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ date }),
  })
}

function postEntries(selectedDate, periodName, emotions) {
  const token = localStorage.getItem('token')
  const body = {
    day: {
      date: selectedDate,
      periods_attributes: [
        {
          name: periodName,
          emotions_attributes: Array.isArray(emotions)
            ? emotions.map(emotion => ({ name: emotion }))
            : [{ name: emotions }],
        },
      ],
    },
  }

  return fetch(`days`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

function deleteEntryAPI(entryUuid) {
  const token = localStorage.getItem('token')
  return fetch(`/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
}

export { fetchDay, fetchDayByDate, postEntries, deleteEntryAPI, redirectToOauthAuthorization, exchangeAuthorizationCodeForToken }