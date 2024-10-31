import { fetchDayByDate, fetchLast30DaysFromAPI } from "../clients/api"

const GET_DAY_FOR_DATE = 'GET_DAY_FOR_DATE'
const GET_DAY_REQUEST = 'GET_DAY_REQUEST'
const FETCH_DAY_SUCCESS_FOUND = 'FETCH_DAY_SUCCESS_FOUND'
const FETCH_DAY_SUCCESS_NOT_FOUND = 'FETCH_DAY_SUCCESS_NOT_FOUND'
const FETCH_DAYS_SUCCESS = 'FETCH_DAYS_SUCCESS'
const FETCH_DAYS_FAILURE = 'FETCH_DAYS_FAILURE'

export {
  GET_DAY_FOR_DATE,
  GET_DAY_REQUEST,
  FETCH_DAY_SUCCESS_FOUND,
  FETCH_DAY_SUCCESS_NOT_FOUND,
  FETCH_DAYS_SUCCESS,
  FETCH_DAYS_FAILURE,
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
  return async function getDayThunk(dispatch, getState) {
    const state = getState()
    const existingDayForDate = state.days.find(
      day => day.date === selectedDate
    )

    if (existingDayForDate !== undefined) {
      console.log("selected day found in store, not making call")
    } else {
      // console.log("selected day not found in store, making call")
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

export function fetchLast30DaysWithEntries() {
  return async function fetchDaysThunk(dispatch, getState) {
    const state = getState()
    // const daysInStore = state.days.length > 0

    // if (daysInStore) {
    //   console.log("Last 30 days with entries found in store, not making API call")
    // } else {
      console.log("Fetching last 30 days with entries from API")
      try {
        const response = await fetchLast30DaysFromAPI()
        dispatch({
          type: FETCH_DAYS_SUCCESS,
          payload: response,
        })
      } catch (error) {
        dispatch({
          type: FETCH_DAYS_FAILURE,
          payload: error || 'Failed to fetch days',
        })
      }
    }
  // }
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