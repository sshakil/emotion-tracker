import { postEntries } from "../clients/api";

const CREATE_ENTRIES = 'CREATE_ENTRIES';
const CREATE_ENTRIES_SUCCESS = 'CREATE_ENTRIES_SUCCESS';

export {
  CREATE_ENTRIES,
  CREATE_ENTRIES_SUCCESS,
}

export function createEntries(selectedDate, periodName, emotions) {
  return async function getEntryThunk(dispatch, getState) {
    try {
      const response = await postEntries(selectedDate, periodName, emotions);
      if (response.status === 204) {
        console.log("successfully created entries");

        // Dispatch success action to update the state
        dispatch({
          type: CREATE_ENTRIES_SUCCESS,
          payload: { selectedDate, periodName, emotions }
        });
      } else {
        console.log("bad request or error");
      }
    } catch (error) {
      console.log(error);
    }
  }
}