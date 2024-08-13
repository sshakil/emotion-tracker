import { convertToYYYYMMDD } from "../utils"

const initialState = {
  date: convertToYYYYMMDD(new Date())
}

export default function selectedDate(state = initialState, action) {
  switch(action.type) {
    case "SET_SELECTED_DATE":
      console.log("SET_SELECTED_DATE ", { ...state, date: action.selectedDate })
      return { ...state, date: action.selectedDate }
    case "GET_SELECTED_DATE":
      return state.date;
    default:
      return state
  }
}