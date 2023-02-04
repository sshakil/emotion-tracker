import { postEntries } from "../clients/api";

const CREATE_ENTRIES = 'CREATE_ENTRIES'

export {
  CREATE_ENTRIES
}

export function createEntries(selectedDate, periodName, emotions) {
  return async function getEntryThunk(dispatch, state) {
    postEntries(selectedDate, periodName, emotions)
      .then(response => {
        // console.log(response)
        response.status === 204 ?
          //todo dispatch actions that update state
          console.log("successfully created entries") :
          console.log("bad request or error")
      }).catch(error => console.log(error))
  }

}