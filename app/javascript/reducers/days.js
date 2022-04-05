// todo - needs to be an array
import { FETCH_DAY_SUCCESS_FOUND, FETCH_DAY_SUCCESS_NOT_FOUND } from "../actions";

const initialState = []

export default function days(currentState = initialState, action) {
  switch(action.type) {
    case "GET_DAY_FOR_DATE":
      return currentState.days.find(
        day => day.date === action.date.toLocaleDateString()
      )
    case "FETCH_DAY_SUCCESS_FOUND":
      // console.log("GET_DAY_SUCCESS_FOUND, adding this in - ", action.json)
      return [...currentState, action.json]
    case "FETCH_DAY_SUCCESS_NOT_FOUND":
      // console.log("GET_DAY_SUCCESS_NOT_FOUND")
      return currentState
    default:
      return currentState
  }
}