function fetchDay(id) {
  return fetch(`days/${id}`)
}

function fetchDayByDate(date) {
  return fetch(`days/fetch`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify({ "date": date })
  })
}

export { fetchDay, fetchDayByDate }