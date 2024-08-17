function fetchDay(id) {
  return fetch(`days/${id}`)
}

function fetchDayByDate(date) {
  return fetch(`days/fetch`, {
    headers: {
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
}

function deleteEntryAPI(entryUuid) {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  return fetch(`/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    }
  })
}

export {fetchDay, fetchDayByDate, postEntries, deleteEntryAPI}