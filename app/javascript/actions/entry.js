// entry.js

import { postEntries, deleteEntryAPI } from "../clients/api"
import selectedDate from "../reducers/selectedDate";

const CREATE_ENTRIES = 'CREATE_ENTRIES'
const CREATE_ENTRIES_SUCCESS = 'CREATE_ENTRIES_SUCCESS'
const DELETE_ENTRY_SUCCESS = 'DELETE_ENTRY_SUCCESS'

export {
  CREATE_ENTRIES,
  CREATE_ENTRIES_SUCCESS,
  DELETE_ENTRY_SUCCESS,
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
function deleteEntry(entryUuid, selectedDate, periodName) {
  return async function deleteEntryThunk(dispatch) {
    deleteEntryAPI(entryUuid)
      .then(response => {
        if (response.status === 204) {
          dispatch({
            type: DELETE_ENTRY_SUCCESS,
            payload: {
              uuid: entryUuid,
              date: selectedDate,
              periodName: periodName
            }
          })
          // console.log("successfully deleted entry")
        } else {
          // todo: add action
          console.log("Failed to delete entry")
        }
      }).catch(error => console.log(error))
  }
}

export { createEntries, deleteEntry }