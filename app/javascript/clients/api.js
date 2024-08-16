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

function postEntries(selectedDate, periodName, emotions) {
  console.log("POST ENTRIES")

  const body =
    {
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

  console.log("BODY: ", JSON.stringify(body))

  return fetch(`days`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
}
function deleteEntryAPI(selectedDate, periodName, emotionName) {
  return fetch(`/entries`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      day_id: selectedDate,
      period_id: periodName,
      emotion_id: emotionName,
    })
  });
}

export { fetchDay, fetchDayByDate, postEntries, deleteEntryAPI }