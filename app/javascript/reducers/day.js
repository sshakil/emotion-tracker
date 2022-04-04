// todo - needs to be an array
const initialState = {
  date: "date",
  periods: [
    {
      name: "earlyMorning",
      emotions: [],
    },
    {
      name: "morning",
      emotions: [],
    },
    {
      name: "afternoon",
      emotions: [],
    },
    {
      name: "evening",
      emotions: [],
    },
    {
      name: "beforeBed",
      emotions: [],
    }
  ]
}

export default function day(currentState = initialState, action) {
  switch(action.type) {
    case "GET_DAY":
      return currentState
    case "GET_DAY_SUCCESS_FOUND":
      console.log("GET_DAY_SUCCESS_FOUND - ", action.json)
      return Object.assign({}, currentState, action.json)
    case "GET_DAY_SUCCESS_NOT_FOUND":
      console.log("GET_DAY_SUCCESS_NOT_FOUND - ")
      return Object.assign({}, currentState, initialState)
    default:
      return currentState
  }
  // return state
}