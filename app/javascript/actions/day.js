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
    //todo: this would need to be recalled if
    //  a) today's date has changed since last load / has been some time
    //  b) changes were made through a session elsewhere
    //  c) changes through the log form may not need this to be recalled if there's 1:1 in
    //      setting those changes in redux store and backend
    //
    // const daysInStore = state.days.length > 0
    //
    // if (daysInStore) {
    //   console.log("Last 30 days with entries found in store, not making API call")
    // } else {
      console.log("Fetching last 30 days with entries from API")
      try {
        const response = await fetchLast30DaysFromAPI()
        const data = await response.json()

        dispatch({
          type: FETCH_DAYS_SUCCESS,
          payload: data,
        })
      } catch (error) {
        console.error("Failed to fetch last 30 days with entries:", error)
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