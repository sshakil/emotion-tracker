import { postEntries } from "../clients/api"

const CREATE_ENTRIES = 'CREATE_ENTRIES'
const CREATE_ENTRIES_SUCCESS = 'CREATE_ENTRIES_SUCCESS'

export {
  CREATE_ENTRIES,
  CREATE_ENTRIES_SUCCESS
}

export function createEntries(selectedDate, periodName, emotions) {
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