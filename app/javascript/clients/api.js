const jwtHeader = "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImEyZWJlNzlkMzBmMzU4NzM4YWQ1ZDU4MDE1OWJiNTM3In0.d-azxSq0--ba6tu0K2YrHpCZyBYGX3XJF-KynpxPGIk"
function fetchDay(id) {
  return fetch(`days/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${localStorage.getItem("token")}`
      "Authorization": jwtHeader
    },

  })
}

function fetchDayByDate(date) {
  return fetch(`days/fetch`, {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${localStorage.getItem("token")}`
      "Authorization": jwtHeader
    },
    method: 'POST',
    body: JSON.stringify({"date": date})
  })
}

function postEntries(selectedDate, periodName, emotions) {

  const body = {
    "day": {
      "date": selectedDate,
      "periods_attributes": [
        {
          "name": periodName,
          "emotions_attributes": Array.isArray(emotions) ? emotions.map(emotion => {
            return {"name": emotion}
          }) : [{"name": emotions}]
        }]
    }
  }

  return fetch(`days`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwtHeader
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
}

function deleteEntryAPI(entryUuid) {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  return fetch(`/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
      "Authorization": jwtHeader
    }
  })
}

export {fetchDay, fetchDayByDate, postEntries, deleteEntryAPI}