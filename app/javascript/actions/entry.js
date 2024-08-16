// entry.js

import { postEntries, deleteEntryAPI } from "../clients/api"

const CREATE_ENTRIES = 'CREATE_ENTRIES'
const CREATE_ENTRIES_SUCCESS = 'CREATE_ENTRIES_SUCCESS'

export {
  CREATE_ENTRIES,
  CREATE_ENTRIES_SUCCESS
}

function createEntries(selectedDate, periodName, emotions) {
  return async function getEntryThunk(dispatch, getState) {
    postEntries(selectedDate, periodName, emotions)
      .then(response => {
        if (response.status === 204) {
          // Dispatch success action to update the store
          dispatch({
            type: CREATE_ENTRIES_SUCCESS,
            payload: {
              date: selectedDate,
              periodName,
              emotions: emotions.map(emotion => ({ name: emotion }))
            }
          })
          console.log("successfully created entries")
        } else {
          console.log("bad request or error")
        }
      }).catch(error => console.log(error))
  }
}
function deleteEntry(selectedDate, periodName, emotionName) {
  return async function deleteEntryThunk(dispatch) {
    deleteEntryAPI(selectedDate, periodName, emotionName)
      .then(response => {
        if (response.status === 204) {
          // Dispatch an action to update the store or refresh the data if needed
          console.log("Successfully deleted entry")
        } else {
          console.log("Failed to delete entry")
        }
      }).catch(error => console.log(error))
  }
}

export { createEntries, deleteEntry }