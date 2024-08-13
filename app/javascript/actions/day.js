import { fetchDayByDate } from "../clients/api";

const GET_DAY_FOR_DATE = 'GET_DAY_FOR_DATE'
const GET_DAY_REQUEST = 'GET_DAY_REQUEST'
const FETCH_DAY_SUCCESS_FOUND = 'FETCH_DAY_SUCCESS_FOUND'
const FETCH_DAY_SUCCESS_NOT_FOUND = 'FETCH_DAY_SUCCESS_NOT_FOUND'

export {
  GET_DAY_FOR_DATE,
  GET_DAY_REQUEST,
  FETCH_DAY_SUCCESS_FOUND,
  FETCH_DAY_SUCCESS_NOT_FOUND
}

export function setSelectedDate(newSelectedDate) {
  return function(dispatch) {
    dispatch({
      type: "SET_SELECTED_DATE",
      selectedDate: newSelectedDate
    })
  }
}

export function fetchDayIfNotInStore(selectedDate) {
  console.log("fetchDayIfNotInStore")
  return async function getDayThunk(dispatch, getState) {
    const state = getState()
    const existingDayForDate = state.days.find(
      day => day.date === selectedDate
    )

    if (existingDayForDate !== undefined) {
      console.log("selected day found in store, not making call")
    } else {
      console.log("selected day not found in store, making call")
      fetchDayByDate(selectedDate.toLocaleString())
        .then(response => response.json())
        .then(json => {
            json ?
              getDaySuccessFound(dispatch, json) :
              getDaySuccessNotFound(dispatch)
          }
        )
        .catch(error => console.log(error))
    }
  }
}

function getDaySuccessFound(dispatch, json) {
  dispatch ({
    type: FETCH_DAY_SUCCESS_FOUND,
    json
  })
}

function getDaySuccessNotFound(dispatch) {
  dispatch ({ type: FETCH_DAY_SUCCESS_NOT_FOUND })
}