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
    try {
      const response = await postEntries(selectedDate, periodName, emotions)
      if (response.ok) {
        const data = await response.json()
        dispatch({
          type: CREATE_ENTRIES_SUCCESS,
          payload: {
            date: selectedDate,
            periodName,
            entries: data.entries
          }
        })
      } else {
        console.log("bad request or error")
      }
    } catch (error) {
      console.log("Error:", error)
    }
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