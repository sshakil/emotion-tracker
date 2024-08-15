import { FETCH_DAY_SUCCESS_FOUND, FETCH_DAY_SUCCESS_NOT_FOUND, CREATE_ENTRIES_SUCCESS } from "../actions"

const initialState = []

export default function days(currentState = initialState, action) {
  switch(action.type) {
    case "GET_DAY_FOR_DATE":
      return currentState.days.find(
        day => day.date === action.date
      )
    case "FETCH_DAY_SUCCESS_FOUND":
      console.log("GET_DAY_SUCCESS_FOUND, adding this in - ", action.json)
      return [...currentState, action.json]
    case "FETCH_DAY_SUCCESS_NOT_FOUND":
      return currentState
    case "CREATE_ENTRIES_SUCCESS":
      return currentState.map(day => {
        if (day.date === action.payload.date) {
          return {
            ...day,
            periods: day.periods.map(period => {
              if (period.name === action.payload.periodName) {
                return {
                  ...period,
                  emotions: [...period.emotions, ...action.payload.emotions]
                }
              }
              return period
            })
          }
        }
        return day
      })
    default:
      return currentState
  }
}